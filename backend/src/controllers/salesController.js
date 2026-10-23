const prisma = require('../config/prisma');

/**
 * GET /api/sales/metrics
 * Dashboard metrics khusus Sales: kredit vs tunai, antrian, omzet pembiayaan, insentif estimasi
 */
exports.getMetrics = async (req, res) => {
  try {
    const salesId = req.user.role === 'sales' ? req.user.id : null;

    // Semua order (atau filter per sales jika role sales)
    const whereClause = salesId ? { salesId } : {};

    const [allOrders, creditOrders, pendingOrders, laptopsLowStock] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        select: { id: true, totalAmount: true, paymentStatus: true, isCredit: true, monthlyInstallment: true, financingProvider: true }
      }),
      prisma.order.findMany({
        where: { ...whereClause, isCredit: true },
        select: { totalAmount: true, monthlyInstallment: true, financingProvider: true }
      }),
      prisma.order.findMany({
        where: { ...whereClause, paymentStatus: 'pending' },
        select: { id: true, orderNumber: true }
      }),
      prisma.laptop.findMany({
        where: { stock: { lt: 3 } },
        select: { id: true, brand: true, model: true, stock: true },
        orderBy: { stock: 'asc' },
        take: 5
      })
    ]);

    const totalOrders = allOrders.length;
    const creditCount = creditOrders.length;
    const creditRatio = totalOrders > 0 ? Math.round((creditCount / totalOrders) * 100) : 0;

    const totalRevenue = allOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    const creditRevenue = creditOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

    // Estimasi insentif: 1.5% dari volume pembiayaan kredit
    const estimatedIncentive = creditRevenue * 0.015;

    res.json({
      success: true,
      data: {
        total_orders: totalOrders,
        credit_orders: creditCount,
        credit_ratio_percent: creditRatio,
        pending_verification: pendingOrders.length,
        total_revenue: totalRevenue,
        credit_revenue: creditRevenue,
        estimated_incentive: Math.round(estimatedIncentive),
        low_stock_alerts: laptopsLowStock
      }
    });
  } catch (error) {
    console.error('Error getMetrics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/sales/orders/create-assisted
 * Assisted Checkout oleh Sales — langsung membuat pesanan kredit atas nama pelanggan
 */
exports.createAssistedOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method = 'credit_card',
      is_credit = true,
      credit_tenor = 12,
      dp_amount = 0,
      financing_provider = 'BCA Kartu Kredit 0%',
      items = []
    } = req.body;

    if (!customer_name || !customer_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap, nomor WhatsApp, dan alamat pengiriman wajib diisi!'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Item pesanan tidak boleh kosong!' });
    }

    const salesUserId = req.user.id;

    const orderResult = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const targetId = parseInt(item.laptop_id ?? item.id, 10);
        if (!targetId || isNaN(targetId)) throw new Error(`ID node infrastruktur tidak valid: ${item.laptop_id ?? item.id}`);

        const laptop = await tx.laptop.findUnique({ where: { id: targetId } });
        if (!laptop) throw new Error(`Node infrastruktur ID ${targetId} tidak ditemukan.`);

        const qty = parseInt(item.quantity || 1, 10);
        if (laptop.stock < qty) throw new Error(`Kapasitas node ${laptop.brand} ${laptop.model} tidak mencukupi (tersedia: ${laptop.stock} Node).`);

        const unitPrice = parseFloat(laptop.price);
        const subtotal = unitPrice * qty;
        totalAmount += subtotal;

        await tx.laptop.update({ where: { id: laptop.id }, data: { stock: { decrement: qty } } });
        orderItemsData.push({ laptopId: laptop.id, quantity: qty, unitPrice, subtotal });
      }

      // Hitung cicilan bulanan setelah DP
      const loanAmount = totalAmount - parseFloat(dp_amount || 0);
      const isCredit = Boolean(is_credit);
      const tenor = parseInt(credit_tenor, 10) || 12;
      const monthly = isCredit && tenor > 0 ? loanAmount / tenor : null;

      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `SI-${todayStr}-${randomSuffix}`;

      // Payment code kredit
      let payCode, bankLabel;
      if (payment_method === 'credit_card') {
        payCode = `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)} (Cicilan ${tenor}x 0%)`;
        bankLabel = `Kartu Kredit Cicilan 0% (${tenor}x Bulan)`;
      } else if (payment_method === 'paylater') {
        payCode = `PL-${financing_provider.split(' ')[0].toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
        bankLabel = `Paylater ${financing_provider} (${tenor}x Bulan)`;
      } else {
        const randNum = Math.floor(100000000 + Math.random() * 900000000);
        payCode = `88012${randNum}`;
        bankLabel = 'BCA Virtual Account';
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: customer_name,
          customerEmail: customer_email || 'guest@smartinfra.com',
          customerPhone: customer_phone,
          shippingAddress: shipping_address,
          totalAmount,
          paymentMethod: payment_method,
          paymentStatus: 'pending',
          isCredit,
          creditTenor: isCredit ? tenor : null,
          monthlyInstallment: monthly !== null ? monthly : null,
          dpAmount: parseFloat(dp_amount || 0),
          financingProvider: isCredit ? financing_provider : null,
          salesId: salesUserId,
          items: { create: orderItemsData },
          payment: {
            create: {
              payCode,
              bankName: bankLabel,
              amount: totalAmount,
              status: 'pending'
            }
          }
        },
        include: {
          items: { include: { laptop: true } },
          payment: true
        }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Pesanan kredit berhasil dibuat oleh Sales.',
      data: {
        order_id: orderResult.id,
        order_number: orderResult.orderNumber,
        customer_name: orderResult.customerName,
        total_amount: parseFloat(orderResult.totalAmount),
        is_credit: orderResult.isCredit,
        credit_tenor: orderResult.creditTenor,
        monthly_installment: orderResult.monthlyInstallment ? parseFloat(orderResult.monthlyInstallment) : null,
        dp_amount: parseFloat(orderResult.dpAmount || 0),
        financing_provider: orderResult.financingProvider,
        payment_info: {
          bank_name: orderResult.payment?.bankName,
          pay_code: orderResult.payment?.payCode,
          amount: parseFloat(orderResult.payment?.amount || orderResult.totalAmount)
        },
        items: orderResult.items.map(i => ({
          id: i.laptopId,
          infrastructure_id: i.laptopId,
          laptop_id: i.laptopId,
          brand: i.laptop.brand,
          model: i.laptop.model,
          quantity: i.quantity,
          unit_price: parseFloat(i.unitPrice),
          subtotal: parseFloat(i.subtotal)
        }))
      }
    });
  } catch (error) {
    console.error('Error createAssistedOrder:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/sales/credit-calculator
 * Kalkulator simulasi kredit publik — tanpa autentikasi
 * Query: price, dp_amount, tenor (3/6/12/24), provider
 */
exports.calculateCreditSimulation = (req, res) => {
  try {
    const price = parseFloat(req.query.price || 0);
    const dpAmount = parseFloat(req.query.dp_amount || 0);
    const providers = [
      { name: 'BCA Kartu Kredit 0%', type: 'credit_card', interestRate: 0, tenors: [3, 6, 12, 24] },
      { name: 'Mandiri Kartu Kredit 0%', type: 'credit_card', interestRate: 0, tenors: [3, 6, 12] },
      { name: 'BRI Kartu Kredit 0%', type: 'credit_card', interestRate: 0, tenors: [3, 6, 12] },
      { name: 'BNI Kartu Kredit 0%', type: 'credit_card', interestRate: 0, tenors: [3, 6, 12] },
      { name: 'Kredivo', type: 'paylater', interestRate: 2.6, tenors: [1, 3, 6, 12] },
      { name: 'Akulaku', type: 'paylater', interestRate: 2.6, tenors: [3, 6, 12] },
      { name: 'ShopeePayLater', type: 'paylater', interestRate: 2.95, tenors: [1, 3, 6] },
      { name: 'Home Credit', type: 'multifinance', interestRate: 1.8, tenors: [6, 12, 18, 24] },
      { name: 'FIF (Federal Internusa)', type: 'multifinance', interestRate: 2.0, tenors: [6, 12, 18, 24] },
      { name: 'AEON Credit Service', type: 'multifinance', interestRate: 1.9, tenors: [6, 12, 24] }
    ];

    const loanAmount = price - dpAmount;

    const simulation = providers.map(p => {
      const tenorOptions = p.tenors.map(tenor => {
        let monthlyInstallment;
        if (p.interestRate === 0) {
          monthlyInstallment = loanAmount / tenor;
        } else {
          // Flat interest calculation
          const totalInterest = loanAmount * (p.interestRate / 100) * tenor;
          monthlyInstallment = (loanAmount + totalInterest) / tenor;
        }
        const dailyCost = monthlyInstallment / 30;
        const totalCost = monthlyInstallment * tenor + dpAmount;
        return {
          tenor,
          monthly_installment: Math.round(monthlyInstallment),
          daily_cost: Math.round(dailyCost),
          total_cost: Math.round(totalCost),
          total_interest: p.interestRate > 0 ? Math.round(loanAmount * (p.interestRate / 100) * tenor) : 0
        };
      });
      return {
        provider: p.name,
        type: p.type,
        interest_rate_per_month: p.interestRate,
        dp_amount: dpAmount,
        loan_amount: loanAmount,
        tenors: tenorOptions
      };
    });

    res.json({
      success: true,
      price,
      dp_amount: dpAmount,
      loan_amount: loanAmount,
      data: simulation
    });
  } catch (error) {
    console.error('Error calculateCreditSimulation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

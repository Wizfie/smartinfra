const prisma = require('../config/prisma');

// Helper: generate unique payment code
function generatePaymentCode(method, tenor) {
  const randNum = Math.floor(100000000 + Math.random() * 900000000);
  switch (method) {
    case 'bca_va':
      return `88012${randNum}`;
    case 'mandiri_va':
      return `89211${randNum}`;
    case 'bri_va':
      return `10293${randNum}`;
    case 'qris':
      return `00020101021226600016ID.CO.SMARTINFRA.WWW01189360091800000${Math.floor(1000 + Math.random() * 9000)}`;
    case 'credit_card':
      return `4532 •••• •••• ${Math.floor(1000 + Math.random() * 9000)} (Cicilan ${tenor || 12}x)`;
    case 'paylater':
      return `PL-KREDIVO-${Math.floor(10000000 + Math.random() * 90000000)}`;
    default:
      return `VA${randNum}`;
  }
}

// POST /api/orders/checkout
exports.checkout = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method = 'bca_va',
      installment_tenor = null,
      items = []
    } = req.body;

    if (!customer_name || !customer_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Nama lengkap, nomor WhatsApp, dan alamat pengiriman wajib diisi!'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Keranjang belanja tidak boleh kosong!'
      });
    }

    // 1. Jalankan Transaksi Database via Prisma
    const orderResult = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const rawId = item.laptop_id ?? item.id;
        const targetId = parseInt(rawId, 10);
        if (!targetId || isNaN(targetId)) {
          throw new Error(`Item di keranjang memiliki ID node infrastruktur tidak valid: ${rawId}`);
        }

        const laptop = await tx.laptop.findUnique({
          where: { id: targetId }
        });

        if (!laptop) {
          throw new Error(`Node infrastruktur dengan ID ${targetId} tidak ditemukan di database.`);
        }

        const qty = parseInt(item.quantity || 1, 10);
        if (laptop.stock < qty) {
          throw new Error(`Kapasitas alokasi untuk ${laptop.brand} ${laptop.model} tidak mencukupi (tersedia: ${laptop.stock} Node).`);
        }

        const unitPrice = parseFloat(laptop.price);
        const subtotal = unitPrice * qty;
        totalAmount += subtotal;

        // Kurangi stok kapasitas node
        await tx.laptop.update({
          where: { id: laptop.id },
          data: {
            stock: { decrement: qty }
          }
        });

        orderItemsData.push({
          laptopId: laptop.id,
          quantity: qty,
          unitPrice,
          subtotal
        });
      }

      // Buat Nomor Pesanan Unik
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `SI-${todayStr}-${randomSuffix}`;

      // Buat kode pembayaran simulasi
      const payCode = generatePaymentCode(payment_method, installment_tenor);
      let bankLabel = 'BCA Virtual Account';
      if (payment_method === 'mandiri_va') bankLabel = 'Mandiri Virtual Account';
      else if (payment_method === 'bri_va') bankLabel = 'BRI Virtual Account';
      else if (payment_method === 'qris') bankLabel = 'QRIS Instan (Gopay / ShopeePay / OVO)';
      else if (payment_method === 'credit_card') bankLabel = `Kartu Kredit Cicilan 0% (${installment_tenor || 12}x Bulan)`;
      else if (payment_method === 'paylater') bankLabel = `Paylater & Kredit Instan (${installment_tenor || 3}x Bulan)`;

      // Simpan Order beserta Items dan SimulatedPayment
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
          items: {
            create: orderItemsData
          },
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
          items: {
            include: {
              laptop: true
            }
          },
          payment: true
        }
      });

      return newOrder;
    });

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat, silakan lanjutkan pembayaran simulasi.',
      data: {
        order_id: orderResult.id,
        order_number: orderResult.orderNumber,
        customer_name: orderResult.customerName,
        total_amount: parseFloat(orderResult.totalAmount),
        payment_method: orderResult.paymentMethod,
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
    console.error('Error during checkout (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders/:order_number/simulate-pay
exports.simulatePay = async (req, res) => {
  try {
    const { order_number } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber: order_number },
      include: { payment: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    if (order.paymentStatus === 'paid') {
      return res.json({
        success: true,
        message: 'Pesanan ini sudah lunas sebelumnya.',
        data: order
      });
    }

    // Update status order dan payment
    const updates = [
      prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          paidAt: new Date()
        }
      })
    ];

    if (order.payment) {
      updates.push(
        prisma.simulatedPayment.update({
          where: { orderId: order.id },
          data: {
            status: 'success'
          }
        })
      );
    }

    await prisma.$transaction(updates);

    res.json({
      success: true,
      message: 'Simulasi Pembayaran Berhasil! Status pesanan kini LUNAS (PAID).',
      order_number
    });
  } catch (error) {
    console.error('Error during simulate payment (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:order_number
exports.getByOrderNumber = async (req, res) => {
  try {
    const { order_number } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber: order_number },
      include: {
        items: {
          include: {
            laptop: true
          }
        },
        payment: true
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    }

    const formatted = {
      id: order.id,
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      shipping_address: order.shippingAddress,
      total_amount: parseFloat(order.totalAmount),
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      paid_at: order.paidAt,
      created_at: order.createdAt,
      payment: order.payment ? {
        bank_name: order.payment.bankName,
        pay_code: order.payment.payCode,
        amount: parseFloat(order.payment.amount),
        status: order.payment.status
      } : null,
      items: order.items.map(i => ({
        id: i.id,
        laptop_id: i.laptopId,
        brand: i.laptop.brand,
        model: i.laptop.model,
        sku: i.laptop.sku,
        screen_desc: i.laptop.screenDesc,
        image_url: i.laptop.imageUrl,
        quantity: i.quantity,
        unit_price: parseFloat(i.unitPrice),
        subtotal: parseFloat(i.subtotal)
      }))
    };

    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error('Error getting order (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders (Admin list)
exports.getAll = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    const where = {};
    if (status) where.paymentStatus = status;

    // Jika yang login adalah role Sales, tampilkan hanya pesanan miliknya
    if (req.user && req.user.role === 'sales') {
      where.salesId = req.user.id;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            laptop: true
          }
        },
        payment: true,
        sales: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { id: 'desc' },
      take: parseInt(limit, 10)
    });

    const formatted = orders.map(o => ({
      id: o.id,
      order_number: o.orderNumber,
      customer_name: o.customerName,
      customer_email: o.customerEmail,
      customer_phone: o.customerPhone,
      shipping_address: o.shippingAddress,
      total_amount: parseFloat(o.totalAmount),
      payment_method: o.paymentMethod,
      payment_status: o.paymentStatus,
      is_credit: o.isCredit,
      credit_tenor: o.creditTenor,
      monthly_installment: o.monthlyInstallment ? parseFloat(o.monthlyInstallment) : null,
      dp_amount: parseFloat(o.dpAmount || 0),
      financing_provider: o.financingProvider,
      sales_id: o.salesId,
      sales_name: o.sales?.name || null,
      sales_email: o.sales?.email || null,
      paid_at: o.paidAt,
      created_at: o.createdAt,
      total_items: o.items.length,
      laptop: o.items[0]?.laptop ? {
        brand: o.items[0].laptop.brand,
        model: o.items[0].laptop.model
      } : null,
      laptop_name: o.items[0]?.laptop ? `${o.items[0].laptop.brand} ${o.items[0].laptop.model}` : null,
      infrastructure: o.items[0]?.laptop ? {
        brand: o.items[0].laptop.brand,
        model: o.items[0].laptop.model
      } : null,
      infrastructure_name: o.items[0]?.laptop ? `${o.items[0].laptop.brand} ${o.items[0].laptop.model}` : null,
      bank_name: o.payment?.bankName,
      pay_code: o.payment?.payCode
    }));

    res.json({
      success: true,
      total: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('Error listing orders (Prisma):', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

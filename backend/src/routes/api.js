const express = require('express');
const router = express.Router();

const spkController = require('../controllers/spkController');
const infrastructureController = require('../controllers/infrastructureController');
const profileController = require('../controllers/profileController');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const salesController = require('../controllers/salesController');
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. SPK Recommendation Route (Publik)
router.post('/spk/recommend', spkController.getRecommendations);
router.get('/criteria', spkController.getCriteria);


// 2. Infrastructures & Cloud/GPU Server Routes
router.get('/brands', infrastructureController.getBrands);
router.get('/infrastructures/brands', infrastructureController.getBrands);
router.get('/infrastructures', infrastructureController.getAll);
router.get('/infrastructures/:id', infrastructureController.getById);
router.patch('/infrastructures/:id/stock', authenticate, authorizeRoles('admin'), infrastructureController.updateStock);
router.post('/infrastructures', authenticate, authorizeRoles('admin'), infrastructureController.create);
router.put('/infrastructures/:id', authenticate, authorizeRoles('admin'), infrastructureController.update);
router.delete('/infrastructures/:id', authenticate, authorizeRoles('admin'), infrastructureController.delete);

// Legacy aliases for backward compatibility
router.get('/laptops/brands', infrastructureController.getBrands);
router.get('/laptops', infrastructureController.getAll);
router.get('/laptops/:id', infrastructureController.getById);
router.patch('/laptops/:id/stock', authenticate, authorizeRoles('admin'), infrastructureController.updateStock);
router.post('/laptops', authenticate, authorizeRoles('admin'), infrastructureController.create);
router.put('/laptops/:id', authenticate, authorizeRoles('admin'), infrastructureController.update);
router.delete('/laptops/:id', authenticate, authorizeRoles('admin'), infrastructureController.delete);

// 3. User Profiles & Dynamic Weights Routes
router.get('/profiles', profileController.getAll);
router.post('/profiles', authenticate, authorizeRoles('admin'), profileController.create);
router.put('/profiles/:id/weights', authenticate, authorizeRoles('admin'), profileController.updateWeights);
router.put('/profiles/:id', authenticate, authorizeRoles('admin'), profileController.update);
router.delete('/profiles/:id', authenticate, authorizeRoles('admin'), profileController.delete);

// 4. Order & Simulated Payment Routes
router.post('/orders/checkout', orderController.checkout);                        // Publik (guest checkout)
router.get('/orders/:order_number', orderController.getByOrderNumber);            // Publik (resi tracking)
router.get('/orders', authenticate, authorizeRoles('admin', 'sales'), orderController.getAll); // Admin & Sales (Read-Only)
router.post('/orders/:order_number/simulate-pay', orderController.simulatePay); // Simulator Pembayaran Sandbox (Publik) & Verifikasi Admin

// 5. Auth Routes
router.post('/auth/login', authController.login);
router.get('/auth/me', authController.me);

// 6. Sales-Specific Routes
router.get('/sales/metrics', authenticate, authorizeRoles('sales', 'admin'), salesController.getMetrics);
router.post('/sales/orders/create-assisted', authenticate, authorizeRoles('sales', 'admin'), salesController.createAssistedOrder);
router.get('/sales/credit-calculator', salesController.calculateCreditSimulation); // Publik (kalkulator kredit)

module.exports = router;

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import seedData from './utils/seeder.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'AURÉLIA JEWELS API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Serve static frontend files if client build exists
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving production frontend build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // For any client route, serve index.html
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error Handling Middlewares for API
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
const startServer = async () => {
  await connectDB();

  // If DB has no products, seed automatically so everything works immediately!
  try {
    const Product = (await import('./models/Product.js')).default;
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('No products found in DB. Auto-seeding initial collections...');
      await seedData();
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AURÉLIA JEWELS Server running on http://localhost:${PORT}`);
    console.log(`💎 API Health Endpoint: http://localhost:${PORT}/api/health`);
  });

  // Optional convenience redirect on port 3000 for users accustomed to React's default port
  try {
    const redirectApp = express();
    redirectApp.get('*', (req, res) => {
      res.redirect(`http://localhost:5173${req.originalUrl}`);
    });
    redirectApp.listen(3000, '0.0.0.0', () => {
      console.log('🔄 Port 3000 convenience redirector active -> http://localhost:5173');
    }).on('error', () => {
      // Best-effort: ignore if port 3000 is already bound
    });
  } catch (e) {
    // Best-effort
  }

  return server;
};

startServer();

export default app;

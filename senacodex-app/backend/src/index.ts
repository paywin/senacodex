import express from 'express';
import cors from 'cors';
import { config } from '@/config';
import { initDatabase } from '@/config/database';
import { authMiddleware, errorMiddleware } from '@/middleware';
import authRoutes from '@/routes/auth';
import dashboardRoutes from '@/routes/dashboard';
import projectRoutes from '@/routes/projects';

const app = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use(errorMiddleware);

// Initialize app
async function startServer() {
  try {
    await initDatabase();
    console.log('✓ Banco de dados conectado');

    app.listen(config.port, () => {
      console.log(`✓ Servidor rodando em http://localhost:${config.port}`);
      console.log(`✓ Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('✗ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

import express from 'express';
import cors from 'cors';
import { config } from '@/config';
import { initDatabase, isUsingMemoryDatabase, isConnectionRefused } from '@/config/database';
import { errorMiddleware } from '@/middleware';
import authRoutes from '@/routes/auth';
import dashboardRoutes from '@/routes/dashboard';
import projectRoutes from '@/routes/projects';
import seedRoutes from '@/routes/seed';

const app = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', seedRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use(errorMiddleware);

// Initialize app
async function startServer() {
  try {
    await initDatabase();
    console.log(isUsingMemoryDatabase() ? 'Banco em memoria ativo' : 'Banco de dados conectado');

    app.listen(config.port, () => {
      console.log(`Servidor rodando em http://localhost:${config.port}`);
      console.log(`Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    if (isConnectionRefused(error)) {
      console.error('Erro ao conectar no PostgreSQL em localhost:5432.');
      console.error('Suba o banco com "npm run dev:db" ou rode tudo com "npm run dev:full".');
    } else {
      console.error('Erro ao iniciar servidor:', error);
    }

    process.exit(1);
  }
}

startServer();

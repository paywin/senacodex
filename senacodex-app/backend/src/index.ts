import express from 'express';
import cors from 'cors';
import { config } from '@/config';
import { initDatabase, isUsingMemoryDatabase, isConnectionRefused } from '@/config/database';
import { errorMiddleware } from '@/middleware';
import authRoutes from '@/routes/auth';
import dashboardRoutes from '@/routes/dashboard';
import projectRoutes from '@/routes/projects';
import roleBasedDashboardRoutes from '@/routes/roleBasedDashboard';
import seedRoutes from '@/routes/seed';
import uploadRoutes from '@/routes/uploads';
import path from 'path';
import fs from 'fs';

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', uploadRoutes); // Use same base for /:id/versions
app.use('/api/role-dashboard', roleBasedDashboardRoutes);
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

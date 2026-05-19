import express from "express"
import cors from "cors"
import pool from "./config/connection"
import authRoutes from "./routes/auth.routes"
import adminRoutes from "./routes/admin.routes"
import cashierRoutes from "./routes/cashier.routes"
import doctorRoutes from "./routes/doctor.routes"
import { setupSwagger } from "./config/swagger"

const app = express()

app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: false
}));

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cashier', cashierRoutes)
app.use('/api/doctor', doctorRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

setupSwagger(app)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
})

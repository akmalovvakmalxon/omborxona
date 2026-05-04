import express from "express"
import cors from "cors"
import pool from "./config/connection"

const app = express()

app.use(cors())
app.use(express.json())

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
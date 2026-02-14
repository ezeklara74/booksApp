import process from 'process'
import dotenv from 'dotenv'
import { app } from './app.js'
import { initDatabase } from './db/init.js'

dotenv.config()

process.on('unhandledRejection', (err) => {
  console.error('unhandled rejection:', err)
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  console.error('uncaught exception:', err)
  process.exit(1)
})

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0'

// Start listening FIRST so Cloud Run sees the port open
app.listen(PORT, HOST, () => {
  console.info(`express server running on http://${HOST}:${PORT}`)
})

// Connect DB after the server starts
initDatabase()
  .then(() => {
    console.info('database initialization finished')
  })
  .catch((err) => {
    console.error('database initialization failed:', err)
    process.exit(1) // keep this if DB is required
  })

import mongoose from 'mongoose'
import process from 'process'

export function initDatabase() {
  const DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://localhost:27017/blog'

  mongoose.connection.on('open', () => {
    console.log('successfully connected to the database', DATABASE_URL)
  })

  mongoose.connection.on('error', (err) => {
    console.error('error connecting to database:', err)
  })

  return mongoose.connect(DATABASE_URL)
}

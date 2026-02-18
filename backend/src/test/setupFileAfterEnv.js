import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'
import { jest } from '@jest/globals'

import { initDatabase } from '../db/init.js'

jest.setTimeout(60000)

beforeAll(async () => {
  await initDatabase()
})

afterAll(async () => {
  await mongoose.disconnect()
})

import { MongoMemoryServer } from 'mongodb-memory-server'

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create({
    binary: { version: '8.0.0' },
  })

  global.__MONGOD__ = mongod
  process.env.MONGO_URI = mongod.getUri()
}

import { MongoClient, Db, Collection } from 'mongodb'

import {
  InternalCollection,
  AdjustmentCollection,
  ExchangeCollection,
  Marker,
  OrderCollection,
  StrategyCollection,
  TradeCollection,
  WalletCollection,
} from '../types/db.types'

export class MongoLib {
  private connection: Db

  private adjustmentCollection: Collection<AdjustmentCollection>
  private exchangeCollection: Collection<ExchangeCollection>
  private internalCollection: Collection<InternalCollection>
  private markerCollection: Collection<Marker>
  private orderCollection: Collection<OrderCollection>
  private strategyCollection: Collection<StrategyCollection>
  private tradeCollection: Collection<TradeCollection>
  private walletCollection: Collection<WalletCollection>

  public async connect() {
    const mongo = await MongoClient.connect(this.makeConnectionString(), { useNewUrlParser: true })

    this.connection = mongo.db(process.env.MONGO_DB)
  }

  public init() {
    this.adjustmentCollection = this.connection.collection('adjustments')
    this.exchangeCollection = this.connection.collection('exchanges')
    this.internalCollection = this.connection.collection('internal')
    this.markerCollection = this.connection.collection('markers')
    this.orderCollection = this.connection.collection('orders')
    this.strategyCollection = this.connection.collection('strategies')
    this.tradeCollection = this.connection.collection('trades')
    this.walletCollection = this.connection.collection('wallets')

    this.createIndexes()
  }

  get adjustment() {
    return this.adjustmentCollection
  }

  get exchange() {
    return this.exchangeCollection
  }

  get internal() {
    return this.internalCollection
  }

  get marker() {
    return this.markerCollection
  }

  get order() {
    return this.orderCollection
  }

  get strategy() {
    return this.strategyCollection
  }

  get trade() {
    return this.tradeCollection
  }

  get wallet() {
    return this.walletCollection
  }

  private createIndexes() {
    this.internalCollection.createIndex({ name: 1 })

    this.adjustmentCollection.createIndex({ exchange: 1, symbol: 1, strategy: 1, timestamp: 1 })

    this.exchangeCollection.createIndex({ exchange: 1 })

    this.markerCollection.createIndex({ exchange: 1, symbol: 1, from: 1 })
    this.markerCollection.createIndex({ exchange: 1, symbol: 1, to: 1 })

    this.orderCollection.createIndex({ exchange: 1, symbol: 1, timestamp: 1 })

    this.strategyCollection.createIndex({ exchange: 1 })
    this.strategyCollection.createIndex({ exchange: 1, symbol: 1, strategy: 1 })

    this.tradeCollection.createIndex({ exchange: 1, symbol: 1, timestamp: 1 })
    this.tradeCollection.createIndex({ id: 1 }, { unique: true })

    this.walletCollection.createIndex({ exchange: 1, symbol: 1, strategy: 1 })
  }

  private makeConnectionString() {
    this.checkForEnvVars()
    const uname = process.env.MONGO_USERNAME ? encodeURIComponent(process.env.MONGO_USERNAME) : null
    const pword = process.env.MONGO_PASSWORD ? encodeURIComponent(process.env.MONGO_PASSWORD) : null
    const authStr = !uname ? '' : !pword ? `${uname}@` : `${uname}:${pword}@`
    const baseStr = `mongodb://${authStr}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`

    if (!(process.env.MONGO_REPLICA_SET && process.env.MONGO_AUTH_MECHANISM)) return baseStr
    if (process.env.MONGO_REPLICA_SET) return `${baseStr}?replicaSet=${process.env.MONGO_REPLICA_SET}`
    if (process.env.MONGO_AUTH_MECHANISM) return `${baseStr}?authMechanism=${process.env.MONGO_AUTH_MECHANISM}`

    return `${baseStr}?replicaSet=${process.env.MONGO_REPLICA_SET}&authMechanism=${process.env.MONGO_AUTH_MECHANISM}`
  }

  private checkForEnvVars() {
    if (!process.env.MONGO_HOST) throw new Error(`MONGO_HOST is not set.`)
    if (!process.env.MONGO_PORT) throw new Error(`MONGO_PORT is not set.`)
    if (!process.env.MONGO_DB) throw new Error(`MONGO_DB is not set.`)
  }
}

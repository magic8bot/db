import { dbDriver } from '../lib/db-driver.lib'
import { Trade, StoreOpts } from '../types/db.types'

import { chunkedMax, chunkedMin } from '../utils/math'

export class MarkerModel {
  public static async saveMarker(storeOpts: StoreOpts, to: number, from: number, trades: Trade[]) {
    const marker = MarkerModel.makeMarker(storeOpts, to, from, trades)
    await dbDriver.marker.insertOne(marker)

    return marker
  }

  public static async findLatestTradeMarker({ exchange, symbol }: StoreOpts) {
    const marker = await dbDriver.marker.find({ exchange, symbol }).sort({ oldestTime: -1 }).limit(1).toArray()

    return marker.pop()
  }

  private static findInRange({ exchange, symbol }: StoreOpts, cursor: number) {
    return dbDriver.marker.findOne({ exchange, symbol, to: { $gte: cursor }, from: { $lte: cursor } })
  }

  private static makeMarker({ exchange, symbol }: StoreOpts, to: number, from: number, trades: Trade[]) {
    const newestTime = chunkedMax(trades.map(({ timestamp }) => timestamp))
    const oldestTime = chunkedMin(trades.map(({ timestamp }) => timestamp))
    return { exchange, symbol, to, from, oldestTime, newestTime }
  }
}

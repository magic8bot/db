import { dbDriver } from '../lib/db-driver.lib'
import { StoreOpts, Marker } from '../types/db.types'

export class MarkerModel {
  public static async saveMarker(marker: Marker) {
    return dbDriver.marker.insertOne(marker)
  }

  public static async findLatestTradeMarker({ exchange, symbol }: StoreOpts) {
    const marker = await dbDriver.marker.find({ exchange, symbol }).sort({ oldestTime: -1 }).limit(1).toArray()

    return marker.pop()
  }

  public static findInRange({ exchange, symbol }: StoreOpts, cursor: number) {
    return dbDriver.marker.findOne({ exchange, symbol, to: { $gte: cursor }, from: { $lte: cursor } })
  }
}

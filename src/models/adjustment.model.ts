import { dbDriver, Adjustment } from '../'
import { StoreOpts } from '../types/db.types'

export class AdjustmentModel {
  public static adjustWallet(storeOpts: StoreOpts, adjustment: Adjustment) {
    const timestamp = new Date().getTime()
    const data = { ...storeOpts, timestamp, ...adjustment }

    return dbDriver.adjustment.insertOne(data)
  }
}

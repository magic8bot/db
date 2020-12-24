import { dbDriver } from '../lib/db-driver.lib'
import { Wallet, StoreOpts } from '../types/db.types'

export class WalletModel {
  public static loadAll(exchange: string) {
    return dbDriver.wallet.find({ exchange }, { projection: { _id: 0 } }).toArray()
  }

  public static async loadWallet(storeOpts: StoreOpts): Promise<Wallet> {
    const wallet = await dbDriver.wallet.findOne({ ...storeOpts }, { projection: { _id: 0 } })

    return !wallet ? null : { asset: wallet.asset, currency: wallet.currency }
  }

  public static saveWallet(storeOpts: StoreOpts, wallet: Wallet) {
    const timestamp = new Date().getTime()

    return dbDriver.wallet.updateOne({ ...storeOpts }, { $set: { timestamp, ...wallet } }, { upsert: true })
  }
}

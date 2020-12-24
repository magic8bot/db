import { dbDriver } from '../lib/db-driver.lib'
import { Order, OrderWithTrades, StoreOpts } from '../types/db.types'

export enum ORDER_STATE {
  PENDING = 'pending',
  PENDING_CANCEL = 'pending_cancel',
  CANCELED = 'canceled',
  DONE = 'done',
}

export class OrderModel {
  public static newOrder({ exchange, symbol, strategy }: StoreOpts, order: Order | OrderWithTrades) {
    const data = { ...order, exchange, symbol, strategy }

    return dbDriver.order.insertOne(data)
  }

  public static getOpenOrder(storeOpts: StoreOpts, id: string) {
    return dbDriver.order.findOne({ ...storeOpts, id })
  }

  public static saveOrder(storeOpts: StoreOpts, order: OrderWithTrades) {
    const { exchange } = storeOpts
    const { id, ...updatedOrder } = order
    return dbDriver.order.updateOne({ id, exchange }, { $set: { ...updatedOrder } })
  }
}

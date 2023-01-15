import { MongoClient } from 'mongodb'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MongoHelper {
  static client: MongoClient

  public static async connect (): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL)
  }

  public static async close (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
  }
}

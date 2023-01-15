import { Collection, MongoClient, WithId } from 'mongodb'

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

  public static getCollection (collectionName: string): Collection {
    return this.client.db().collection(collectionName)
  }

  public static async add <T>(document: Omit<T, 'id'>, collectionName: string): Promise<T> {
    const collection = this.getCollection(collectionName)

    const { insertedId } = await collection.insertOne(document)
    const id = insertedId.toHexString()

    const { _id, ...result } = await collection.findOne<WithId<Omit<T, 'id'>>>({ _id: insertedId })
    const inserted = {
      id,
      ...result
    } as unknown as T

    return inserted
  }
}

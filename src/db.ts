import { MongoClient, Collection } from 'mongodb';

import { MONGO_URL } from './config';

const connectToDbPromise: Promise<MongoClient> =
  MongoClient.connect(MONGO_URL, { useNewUrlParser: true });

export const getCollection = async (collectionName: string): Promise<Collection> => {
  const mongoClient = await connectToDbPromise;
  return mongoClient.db().collection(collectionName);
}
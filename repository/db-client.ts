import { MongoClient, Db } from "mongodb";

const connectionString = '';
var db: Db


export class DbClient {

    public async connect() {
        db = await MongoClient.connect(connectionString);
        console.log("Connected to db");
        return this.db;
    }
}
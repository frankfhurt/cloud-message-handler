'use strict';

import { Db } from 'mongodb';
import { resolve } from "path";

const TAG: string = `parking service -`

export class ParkingStatusPersister {

    constructor() {
    }

    public async save(parkingStatus: any, db: Db): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            // Fetch a collection
            let collection = db.collection('parkingStatus');

            console.log("Will perform the insertion...")

            collection.insertOne(parkingStatus, (err, result) => {
                if (err != null) {
                    console.error(`${TAG} an error occurred in save`, err);
                    reject(err);
                } else {
                    console.log(`${TAG} parkings status inserted! id: ${result.insertedId}`);
                    resolve(result);
                }
            });
        });
    }
}
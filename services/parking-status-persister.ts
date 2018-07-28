'use strict';

import { Db } from 'mongodb';
import { resolve } from "path";

const TAG: string = `parking service -`

export class ParkingStatusPersister {

    constructor() {
    }

    public async save(parkingStatus: any, db: Db): Promise<any> {
        return new Promise<any>((resolve, reject) => {

            let collection = db.collection('parkingStatus');

            console.log("Will perform the insertion/update...")

            const myquery = { parkingId: parkingStatus.parkingId };

            collection.findOne(myquery, (err, result) => {
                if (err != null) {
                    console.error(`${TAG} an error occurred in FindOne`, err);
                    reject(err);
                } else {
                    console.log(`Result: ${result}`)
                    console.log(`Result Stringfy: ${JSON.stringify(result)}`)
                    if (result) {
                        collection.updateOne({ _id: result._id }, { $set: parkingStatus }, (updateErr, updateResult) => {
                            if (updateErr != null) {
                                console.error(`${TAG} an error occurred in UPDATE`, updateErr);
                                reject(updateErr);
                            } else {
                                console.log(`${TAG} parkings status UPDATED! id: ${updateResult}`);
                                resolve(updateResult);
                            }
                        });
                    } else {
                        collection.insertOne(parkingStatus, (insertErr, insertResult) => {
                            if (insertErr != null) {
                                console.error(`${TAG} an error occurred in INSERT`, insertErr);
                                reject(insertErr);
                            } else {
                                console.log(`${TAG} parkings status INSERTED! id: ${insertResult.insertedId}`);
                                resolve(insertResult);
                            }
                        });
                    }
                }
            });

            // collection.insertOne(parkingStatus, (err, result) => {
            //     if (err != null) {
            //         console.error(`${TAG} an error occurred in save`, err);
            //         reject(err);
            //     } else {
            //         console.log(`${TAG} parkings status inserted! id: ${result.insertedId}`);
            //         resolve(result);
            //     }
            // });
        });
    }
}
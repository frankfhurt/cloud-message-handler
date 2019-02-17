'use strict';

import { Db } from 'mongodb';
import { resolve } from "path";

const TAG: string = `parking status repository -`

export class ParkingStatusRepository {

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
        });
    }

    public async status(parkingId: any, db: Db): Promise<any> {

        return new Promise<any>((resolve, reject) => {

            let collection = db.collection('parkingStatus');

            console.log("Will search by parkingId.")

            const myquery = { parkingId: parkingId };

            collection.findOne(myquery, (err, result) => {
                if (err != null) {
                    console.error(`${TAG} an error occurred in FindOne`, err);
                    reject(err);
                } else {
                    console.log(`Result: ${result}`)
                    console.log(`Result Stringfy: ${JSON.stringify(result)}`)
                    if (result) {
                        console.log(`${TAG} parkings status found for parking: ${parkingId}`);

                        delete result._id;

                        resolve(result)
                    } else {
                        console.log(`${TAG} parkings status NOT found for parking: ${parkingId}`);
                        reject(err)
                    }
                }
            });
        });
    }
}
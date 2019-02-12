'use strict';

import {
    Handler,
    Context,
    Callback
} from 'aws-lambda';
import {
    MongoClient,
    Db
} from 'mongodb';
import {
    ParkingStatusPersister
} from '../services/parking-status-persister';

const TAG: string = `lambda -`

let atlas_connection_uri: string;
let cachedDb: Db;
let updateterService: ParkingStatusPersister;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`${TAG} Event: ${JSON.stringify(event)}`);

    const uri: string = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    updateterService = new ParkingStatusPersister();

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback).then((result) => {
            console.log(`${TAG} Successfully inserted`);
            callback(null, {
                message: "Sucess"
            });
        }).catch(err => {
            console.log(`${TAG} Insertion ERROR: ${err}`);
            callback(null, {
                message: "ERROR"
            });
        });
    } else {
        atlas_connection_uri = uri;
        console.log(`${TAG} the Atlas connection string is ${atlas_connection_uri}`);

        processEvent(event, context, callback).then((result) => {
            console.log(`${TAG} Successfully inserted`);
            callback(null, {
                message: "Sucess"
            });
        }).catch(err => {
            console.log(`${TAG} Insertion ERROR: ${err}`);
            callback(null, {
                message: "ERROR"
            });
        });
    }
}

function processEvent(event: any, context: Context, callback: Callback): Promise < any > {

    let parkingStatus = JSON.parse(JSON.stringify(event));

    context.callbackWaitsForEmptyEventLoop = false;

    return new Promise < any > ((resolve, reject) => {
        try {
            if (cachedDb == null) {
                console.log(`${TAG} connecting to database....`);
                MongoClient.connect(atlas_connection_uri, (err, client) => {

                    if (err) throw err;

                    console.log(`${TAG} => connected to database!`);
                    cachedDb = client.db('parkingdb');
                    resolve(updateterService.save(parkingStatus, cachedDb));
                });
            } else {
                console.log(`${TAG} already connected to database!`);
                resolve(updateterService.save(parkingStatus, cachedDb));
            }
        } catch (err) {
            console.error(`${TAG} an error occurred`, err);
            reject(err);
        }
    });
}
'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import { MongoClient, Db } from 'mongodb';
import { ParkingStatusPersister } from '../services/parking-status-updater';

const TAG: string = `lambda -`

let atlas_connection_uri: string;
let cachedDb: Db = null;
let updateterService: ParkingStatusPersister;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`${TAG} Event: ${JSON.stringify(event)}`);

    const uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    updateterService = new ParkingStatusPersister();

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback).then((result) => {
            console.log(`${TAG} Parking status saved`);
            this.callback(null, `${TAG} SUCCESS`);
        }).catch(err => {
            console.log(`${TAG} Send Notification ERROR: ${err}`);
        });
    } else {
        atlas_connection_uri = uri;
        console.log(`${TAG} the Atlas connection string is ${atlas_connection_uri}`);
        processEvent(event, context, callback).then((result) => {
            console.log(`${TAG} Successfully inserted`);
            this.callback(null, "SUCCESS");
        }).catch(err => {
            console.log(`${TAG} Insertion ERROR: ${err}`);
        });
    }
}

function processEvent(event: any, context: Context, callback: Callback): Promise<any> {

    context.callbackWaitsForEmptyEventLoop = false;

    try {
        if (cachedDb == null) {
            console.log(`${TAG} => connecting to database`);
            MongoClient.connect(atlas_connection_uri, (err, client) => {
                cachedDb = client.db('admin');
                return updateterService.save(event, cachedDb)
            });
        }
        else {
            return updateterService.save(event, cachedDb)
        }
    } catch (err) {
        console.error(`${TAG} an error occurred`, err);
    }
}
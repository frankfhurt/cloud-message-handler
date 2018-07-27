'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import { ParkingStatusUpdater } from '../services/parking-status-updater';

let atlas_connection_uri;
let cachedDb = null;
let updateterService: ParkingStatusUpdater;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`Event: ${JSON.stringify(event)}`);

    const uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    updateterService = new ParkingStatusUpdater();

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback);
    } else {
        atlas_connection_uri = uri;
        console.log('the Atlas connection string is ' + atlas_connection_uri);
        processEvent(event, context, callback);
    }
}

function processEvent(event, context, callback) {
    updateterService.update(event).then(() => {
        console.log('Parking status updated!');
    }).catch(err => {
        console.log(`Update ERROR: ${err}`);
    })
}
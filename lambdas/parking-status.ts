'use strict';

import { Handler, Context, Callback } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import { ParkingStatusNotifier } from './../services/parking-status-notifier';
import { ParkingStatusUpdater } from './../services/parking-status-updater';

let atlas_connection_uri;
let cachedDb = null;
let updateterService: ParkingStatusUpdater;
let notificationService: ParkingStatusNotifier;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`Event: ${JSON.stringify(event)}`);

    const uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    const notifications = JSON.parse(event.Records[0].Sns.Message);

    console.log(`Notifications: ${JSON.stringify(notifications)}`);

    updateterService = new ParkingStatusUpdater();
    notificationService = new ParkingStatusNotifier();

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback);
    } else {
        atlas_connection_uri = uri;
        console.log('the Atlas connection string is ' + atlas_connection_uri);
        processEvent(event, context, callback);
    }
}

function processEvent(event, context, callback) {
    updateterService.update(event.Records[0].update).then(() => {
        console.log('Parking status updated!');

        const promises = [];

        // for (const record of event.Records) {
        //     const notificationMessages = JSON.parse(record.Sns.Message);
        //     promises.push(notificationService.notify(notificationMessages.notifications));
        // }

        Promise.all(promises)
            .then(() => {
                console.log('Send Notification Success');
                callback(null, null);
            }).catch(err => {
                console.log(`Send Notification ERROR: ${err}`);
            })

    }).catch(err => {
        console.log(`Send Notification ERROR: ${err}`);
    })
}
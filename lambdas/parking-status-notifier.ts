'use strict';

import {
    Handler,
    Context,
    Callback
} from 'aws-lambda';
import {
    ParkingStatusNotifier
} from '../services/parking-status-notifier';

let notificationService: ParkingStatusNotifier;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`Event: ${JSON.stringify(event)}`);

    const uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    notificationService = new ParkingStatusNotifier();

    notificationService.notify(event).then(value => {
        console.log(`Send Notification Sucess: ${value}`);
    }).catch(err => {
        console.log(`Send Notification ERROR: ${err}`);
    });
}
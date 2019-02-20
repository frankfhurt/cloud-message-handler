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

    const fcmUrl = process.env['FCM_URL'];
    const authKey = process.env['AUTHORIZATION_KEY'];

    notificationService = new ParkingStatusNotifier();

    notificationService.notify(fcmUrl, authKey, event).then(value => {
        console.log(`Send Notification Sucess: ${value}`);
    }).catch(err => {
        console.log(`Send Notification ERROR: ${err}`);
    });
}
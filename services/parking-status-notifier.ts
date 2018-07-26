'use strict';

import { SNS } from 'aws-sdk';

export class ParkingStatusNotifier {

    constructor() {
    }

    public async notify(notifications): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            resolve();
        });

        // const sns = new SNS({
        //     region: 'us-east-1'
        // });

        // const senderTasks = [];

        // notifications.forEach(notification => {

        //     console.log(`Notification: ${JSON.stringify(notification)}`)

        //     const snsMessage = notification.message;
        //     notification.cellphoneNumbers.forEach(cellphoneNumber => {

        //         const sendSMSTask = new Promise((resolve, reject) => {
        //             sns.publish({
        //                 Message: snsMessage,
        //                 PhoneNumber: cellphoneNumber
        //             }, (err, snsResponse) => {
    
        //                 if (err) {
        //                     console.log(`failure to send SMS ${err.message} - ${err.stack}`);
        //                 }

        //                 resolve();
        //             });
        //         });

        //         senderTasks.push(sendSMSTask);
        //     });
        // });

        // Promise.all(senderTasks).then(data => {
        //     return data;
        // }).catch(err => {
        //     console.log(`Failure to send SMS to ${JSON.stringify(notifications)} cellphones`)
        //     return err;
        // });
    }
}
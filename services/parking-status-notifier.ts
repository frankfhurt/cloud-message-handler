'use strict';

import { SNS } from 'aws-sdk';

export class ParkingStatusNotifier {

    constructor() {
    }

    public async notify(notification): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            console.log("Passou pelo Notificador");

            const sns = new SNS({
                region: 'us-east-2'
            });

            // sns.publish({
            //     Message: snsMessage,
            //     PhoneNumber: cellphoneNumber
            // }, (err, snsResponse) => {

            //     if (err) {
            //         console.log(`failure to send SMS ${err.message} - ${err.stack}`);
            //     }

            //     resolve();
            // });
            resolve("Message Sent!!!");
        });
    }
}
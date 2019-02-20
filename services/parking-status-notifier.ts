'use strict';

import request = require("request");

export class ParkingStatusNotifier {

    constructor() {
    }

    public async notify(url, authKey, body): Promise<any> {

        return new Promise<any>((resolve, reject) => {
            console.log("Passou pelo Notificador");

            const body = {
                to: "/topics/parking",
                data: {
                    message: "Update Parking Status"
                }
            }

            request({
                url: url,
                method: 'POST',
                headers: {
                    'Authorization': authKey,
                    'Content-Type': 'application/json'
                },
                body: body,
                json: true
            }, (err, res, body) => {
                if (err) {
                    reject(err)
                }

                resolve(`Message Sent!!! ${JSON.stringify(body)}`);

            });
        });
    }
}
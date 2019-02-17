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
    ParkingStatusRepository
} from '../services/parking-status-persister';

const TAG: string = `parking status -`

let atlas_connection_uri: string;
let cachedDb: Db;
let repositoryService: ParkingStatusRepository;

export const handler: Handler = (event: any, context: Context, callback: Callback) => {

    console.log(`${TAG} Event: ${JSON.stringify(event)}`);

    const uri: string = process.env['MONGODB_ATLAS_CLUSTER_URI'];

    repositoryService = new ParkingStatusRepository();

    if (atlas_connection_uri != null) {
        processEvent(event, context, callback).then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(result)
            };
            callback(null, response);
        }).catch(err => {
            callback(null, {
                statusCode: 404,
                body: "Not Found"
            });
        });
    } else {
        atlas_connection_uri = uri;
        console.log(`${TAG} the Atlas connection string is ${atlas_connection_uri}`);

        processEvent(event, context, callback).then((result) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(result)
            };
            callback(null, response);
        }).catch(err => {
            callback(null, {
                statusCode: 404,
                body: "Not Found"
            });
        });
    }
}

function processEvent(event: any, context: Context, callback: Callback): Promise<any> {

    let parkingId = event.pathParameters.id;

    context.callbackWaitsForEmptyEventLoop = false;

    return new Promise<any>((resolve, reject) => {
        try {
            if (cachedDb == null) {
                console.log(`${TAG} connecting to database....`);
                MongoClient.connect(atlas_connection_uri, (err, client) => {

                    if (err) throw err;

                    console.log(`${TAG} => connected to database!`);
                    cachedDb = client.db('parkingdb');
                    resolve(repositoryService.status(parkingId, cachedDb));
                });
            } else {
                console.log(`${TAG} already connected to database!`);
                resolve(repositoryService.status(parkingId, cachedDb));
            }
        } catch (err) {
            console.error(`${TAG} an error occurred`, err);
            reject(err);
        }
    });
}
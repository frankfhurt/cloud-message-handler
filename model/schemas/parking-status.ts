import { Document, Schema, Model, model } from "mongoose";
import { IParkingStatus } from "../interfaces/parking-status";

export interface IParkingStatusModel extends IParkingStatus, Document {
    fullName(): string;
}

export var ParkingStatusSchema: Schema = new Schema({
    createdAt: Date,
    email: String,
    firstName: String,
    lastName: String
});
ParkingStatusSchema.pre("save", (next) => {
    let now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
ParkingStatusSchema.methods.fullName = function (): string {
    return (this.firstName.trim() + " " + this.lastName.trim());
};

export const ParkingStatus: Model<IParkingStatusModel> = model<IParkingStatusModel>("ParkingStatus", ParkingStatusSchema);
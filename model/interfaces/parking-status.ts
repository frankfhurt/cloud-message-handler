interface IParkingLot {
    id?: string,
    status?: string
}

export interface IParkingStatus {
    lat?: string,
    long?: string,
    parkingId?: string,
    parkingLots?: Array<IParkingLot>
}
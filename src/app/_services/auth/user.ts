export interface User {
    username: string;
    email: string;
    id: number;
    capsulePreference: {
        BedBackAngle: number,
        BedLegAngle: number,
        LightLevel: number,
        SnoozeUser_id: number,
        VolumenLevel: number,
        id: number
    };
    bookings: [];
}

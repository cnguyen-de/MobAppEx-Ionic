export interface booking {
  Amount: number;
  Capsule_id: number;
  Date: string;
  FirstTimeFrame: number;
  IsVerified: boolean;
  LastTimeFrame: number
  PayedAmount: number;
  PayedDate: string;
  PayerEmail: string;
  Pin: number;
  SnoozeUser_id: number;
  Vendor: string;
  capsule: {
    Latitude: number,
    Longitude: number,
    Name: string,
    id: number
  };
  duration: string;
}

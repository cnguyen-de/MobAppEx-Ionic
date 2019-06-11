export interface booking {
  combinedIds: [];
  SnoozeUser_id: number;
  Capsule_id: number;
  Pin: number;
  Date: string;
  FirstTimeFrame: number;
  LastTimeFrame: number
  Vendor: string;
  Amount: number;
  IsVerified: boolean;
  PayedAmount: number;
  PayedDate: string;
  PayerEmail: string;
  Payment_id: string;
  capsule: {
    Latitude: number,
    Longitude: number,
    Name: string,
    id: number
  };
}

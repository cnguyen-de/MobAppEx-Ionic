import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  slots = {
    1: "9:00",
    2: "9:20",
    3: "9:40",
    4: "10:00",
    5: "10:20",
    6: "10:40",
    7: "11:00",
    8: "11:20",
    9: "11:40",
    10: "12:00",
    11: "12:20",
    12: "12:40",
    13: "13:00",
    14: "13:20",
    15: "13:40",
    16: "14:00",
    17: "14:20",
    18: "14:40",
    19: "15:00",
    20: "15:20",
    21: "15:40",
    22: "16:00",
    23: "16:20",
    24: "16:40",
    25: "17:00",
    26: "17:20",
    27: "17:40",
    28: "18:00"
  };

  constructor() { }

  getTimeRange(startTime: number, endTime: number) {
    return this.slots[startTime] + " - " + this.slots[endTime + 1]
  }

  getStartTime(int: number) {
    return this.slots[int];
  }

  getEndTime(int: number) {
    return this.slots[int + 1];
  }

  getIntSlot(time: string) {
    return Object.keys(this.slots).find(key => this.slots[key] === time);
  }
}

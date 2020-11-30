import { Hour } from "./day-model";

export class SchedulerCreator {
  public static create(firstHour: number = 6, segments: number = 6): Hour[] {
    let todayHours = this.createHours(firstHour, 24, segments);
    let tommorowHours = this.createHours(0, firstHour, segments);
    return todayHours.concat(tommorowHours);
  }

  private static createHours(firstHour: number, lastHour: number, segments: number): Hour[] {
    let hours = [];
    for (let hour = firstHour; hour < lastHour; hour++) {
      let segmentTime = Math.floor(60 / segments);
      for (let segment = 0; segment < segments; segment++) {
        let mainHour = segment == 0;
        let lastHour = segment == segments - 1;
        let middleHour = segment == segments / 2;
        let hourElement = new Hour(hour, segmentTime * segment, mainHour, lastHour, middleHour);
        hours.push(hourElement);
      }
    }
    return hours;
  }
}

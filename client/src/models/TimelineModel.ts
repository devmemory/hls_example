export interface TimelineModel {
  startTime: number;
  endTime: number;
  img?: string
}

export interface SaveTimeModel extends TimelineModel {
  start: boolean;
}

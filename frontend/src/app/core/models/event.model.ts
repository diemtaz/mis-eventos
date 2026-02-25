export enum EventStatus {
  PUBLISHED = 'published',
  FULL = 'full',
  CANCELLED = 'cancelled'
}
export interface Event {
  id: number;
  name: string;
  description: string;
  speaker_name?: string;
  capacity: number;
  start_date: string;
  end_date: string;
  status: EventStatus;
  created_by: number;
}
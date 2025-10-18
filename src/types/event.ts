export interface Event {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  ticketPrice: number;
  currency: string;
  capacity: number;
  attendees: number;
  createdAt: Date;
}


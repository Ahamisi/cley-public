import { Product } from "./product";
import { Event } from "./event";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}

export interface Creator extends User {
  links: Link[];
  products: Product[];
  events: Event[];
}

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
}


export interface Product {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  type: "physical" | "digital" | "service";
  createdAt: Date;
}


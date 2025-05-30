
export type Location = "Dad's" | "Mom's" | "School" | "In Transit";
export type Category = "socks" | "sweaters" | "t-shirts" | "pants" | "shoes" | "other";

export interface Item {
  id: string;
  name: string;
  description: string;
  location: Location;
  category: Category;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
  forToday?: boolean;
  reminder?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

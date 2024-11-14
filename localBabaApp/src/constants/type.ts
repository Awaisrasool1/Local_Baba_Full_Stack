type Categories = {
  ID: string;
  Name: string;
  isActive: boolean;
};

type Restaurants = {
  id: string;
  name: string;
  image: any;
  serviesType: string;
  rating: number;
  location: string;
  description: string;
};

export type {Categories, Restaurants};

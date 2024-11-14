export type CartData = {
  id: string;
  image: any;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  product_id: string;
  quantity: number;
  itemTotalPrice: number;
  category: string;
};

export type AddressData = {
  id: string;
  fullAddress: string;
  city: string;
  latlon: string;
  userId: string;
  isDefaultShiping: boolean;
};

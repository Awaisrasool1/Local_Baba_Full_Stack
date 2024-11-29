type Pickup = {
  location: string;
  address: string;
  distance: string;
  time: string;
};

type Dropoff = {
  location: string;
  address: string;
  distance: string;
  time: string;
};
type Props = {
  orderId: string;
  totalBill: string;
  paymentMethod: string;
  pickup: Pickup;
  dropoff: Dropoff;
};

export type {Props, Dropoff, Pickup};

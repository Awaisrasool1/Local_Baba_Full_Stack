type OrderItem = {
  name: string;
  quantity: number;
  total: number;
  price: number;
};

type OrderData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  placedTime: string;
  orderId: string;
  status: string;
  items: OrderItem[];
  totalBill: number;
};
interface Props {
  tableHead: string[];
  type: string;
}
export type { OrderItem, OrderData, Props };

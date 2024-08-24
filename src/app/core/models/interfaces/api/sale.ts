export interface Sale {
  id?: number;
  customer_id: number;
  inventory_id: number;
  payment_method_id: number;
  total_quantity: number;
  total_sale: number;
}

export interface SaleResponse{
    message: string
    data: Sale[]
}

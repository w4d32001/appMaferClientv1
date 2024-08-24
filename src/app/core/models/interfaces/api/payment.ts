export interface Payment {
    id: number
    name: string
}
export interface PaymentResponse{
    message: string
    data: Payment[]
}

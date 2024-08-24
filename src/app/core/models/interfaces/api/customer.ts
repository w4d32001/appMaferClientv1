export interface Customer {
    id: number
    name: string
    surname: string
    dni: string
    ruc: string
    reason: string
    image: string
    address: string
    email: string
    password: string
    phone: string
}

export interface ResponseCustomer{
    message: string
    data: Customer[] 
}
export interface CustomerResponse{
    message: string
    data: Customer
}


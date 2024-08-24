export interface Company {
    id: number
    name: string
    description: string
    img: string
    address: string
    phone: string
}

export interface CompanyResponse{
    message: string
    data: Company[]
}

export interface CompanyR{
    message:string
    data: Company
}
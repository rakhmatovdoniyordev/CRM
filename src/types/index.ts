export interface ICustomer {
    _id: string;
    fname: string;
    lname: string;
    phone_primary: string;
    budget: number;
    address: string;
}

export interface IProducts {
    _id: string;
    title: string;
    category: string;
    price: number;
    quantity: number;
    units: string;
    createdAt: string;
}
import { IBank } from "./bank.interface";

export interface IBusiness {
    businessId : number;
    businessName: string;
    createdAt: Date;
    lastUpdatedAt: Date;
}

export interface IBusinessDetail{
    business: IBusiness,
    banks: {
        bank: IBank,
        balance: number;
        users: {
            userId: number,
            username: string,
            email: string,
        }[]
    }[]
}


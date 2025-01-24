export interface IBalance{
    balance: number;
    updatedAt: Date;
    username: string;
    userId: number;
}

export interface IBalanceDetail{
    balance: number;
    updatedAt: Date;
    bankId: number;
    businessId: number;
    username: string;
    userId: number;
}
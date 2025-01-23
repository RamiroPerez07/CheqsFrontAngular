export interface IBalance{
    balance: number;
    updatedAt: Date;
}

export interface IBalanceDetail{
    balance: number;
    updatedAt: Date;
    bankId: number;
    businessId: number;
}
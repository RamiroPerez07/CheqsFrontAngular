export interface ICheqDetail {
  //campos que vienen desde el endpoint
  cheqId: number;
  cheqNumber: string;
  issueDate: Date;
  createdAt: Date;
  dueDate: Date;
  amount: number;
  userId: number;
  username: string;
  email: string;
  businessId: number;
  businessName: string;
  balance: number;
  typeId: number;
  typeName: string;
  stateId: number;
  stateName: string;
  entityId: number;
  entityName: string;
  //se genera en la interfaz
  accumulatedAmount?: number;
}

export interface ICheq {
  id? : number;
  cheqNumber: string;
  entityId : number;
  typeId : number;
  stateId : number;
  businessUserId: number;
  issueDate: Date;
  dueDate: Date;
  amount: number;
  createdAt : Date;
}
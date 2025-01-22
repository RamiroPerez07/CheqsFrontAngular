import { TestBed } from '@angular/core/testing';

import { BankBusinessUserServiceService } from './bank-business-user-service.service';

describe('BankBusinessUserServiceService', () => {
  let service: BankBusinessUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankBusinessUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

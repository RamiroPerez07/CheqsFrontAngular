import { TestBed } from '@angular/core/testing';

import { CheqsServiceService } from './cheqs-service.service';

describe('CheqsServiceService', () => {
  let service: CheqsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheqsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

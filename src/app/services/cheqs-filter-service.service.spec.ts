import { TestBed } from '@angular/core/testing';

import { CheqsFilterServiceService } from './cheqs-filter-service.service';

describe('CheqsFilterServiceService', () => {
  let service: CheqsFilterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheqsFilterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

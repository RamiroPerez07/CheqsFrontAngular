import { TestBed } from '@angular/core/testing';

import { TypesServiceService } from './types-service.service';

describe('TypesServiceService', () => {
  let service: TypesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { EntitiesServiceService } from './entities-service.service';

describe('EntitiesServiceService', () => {
  let service: EntitiesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitiesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

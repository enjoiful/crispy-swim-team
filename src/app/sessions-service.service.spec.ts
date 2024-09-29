import { TestBed } from '@angular/core/testing';

import { SessionsServiceService } from './sessions-service.service';

describe('SessionsServiceService', () => {
  let service: SessionsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

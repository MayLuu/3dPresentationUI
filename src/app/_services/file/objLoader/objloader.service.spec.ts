import { TestBed } from '@angular/core/testing';

import { ObjloaderService } from './objloader.service';

describe('ObjloaderService', () => {
  let service: ObjloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

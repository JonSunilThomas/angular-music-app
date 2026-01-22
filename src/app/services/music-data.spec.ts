import { TestBed } from '@angular/core/testing';

import { MusicData } from './music-data';

describe('MusicData', () => {
  let service: MusicData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

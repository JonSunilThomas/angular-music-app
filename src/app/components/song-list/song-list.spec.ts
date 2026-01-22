import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListComponent } from './song-list';

describe('SongList', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

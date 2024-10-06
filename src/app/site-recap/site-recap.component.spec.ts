import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteRecapComponent } from './site-recap.component';

describe('SiteRecapComponent', () => {
  let component: SiteRecapComponent;
  let fixture: ComponentFixture<SiteRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteRecapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

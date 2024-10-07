import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiterDetailsComponent } from './kiter-details.component';

describe('KiterDetailsComponent', () => {
  let component: KiterDetailsComponent;
  let fixture: ComponentFixture<KiterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KiterDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KiterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

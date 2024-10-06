import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitersComponent } from './kiters.component';

describe('KitersComponent', () => {
  let component: KitersComponent;
  let fixture: ComponentFixture<KitersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

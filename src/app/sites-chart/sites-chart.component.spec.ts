import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitesChartComponent } from './sites-chart.component';

describe('SitesChartComponent', () => {
  let component: SitesChartComponent;
  let fixture: ComponentFixture<SitesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SitesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

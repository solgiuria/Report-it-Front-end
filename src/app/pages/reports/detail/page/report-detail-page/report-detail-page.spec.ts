import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailPage } from './report-detail-page';

describe('ReportDetailPage', () => {
  let component: ReportDetailPage;
  let fixture: ComponentFixture<ReportDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

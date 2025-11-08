import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFormPage } from './report-form-page';

describe('ReportFormPage', () => {
  let component: ReportFormPage;
  let fixture: ComponentFixture<ReportFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsFeedPage } from './reports-feed-page';

describe('ReportsFeedPage', () => {
  let component: ReportsFeedPage;
  let fixture: ComponentFixture<ReportsFeedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsFeedPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

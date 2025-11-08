import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSection } from './final-section';

describe('FinalSection', () => {
  let component: FinalSection;
  let fixture: ComponentFixture<FinalSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

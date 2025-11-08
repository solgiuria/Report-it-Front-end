import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWoks } from './how-it-woks';

describe('HowItWoks', () => {
  let component: HowItWoks;
  let fixture: ComponentFixture<HowItWoks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWoks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowItWoks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

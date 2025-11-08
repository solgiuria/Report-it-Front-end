import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersListPage } from './admin-users-list-page';

describe('AdminUsersListPage', () => {
  let component: AdminUsersListPage;
  let fixture: ComponentFixture<AdminUsersListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsersListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

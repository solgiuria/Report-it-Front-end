import { Routes } from '@angular/router';
// Páginas públicas
import { LandingPage } from './pages/landing/page/landing-page/landing-page';
import { AuthPage } from './pages/auth/page/auth-page';

// Reports (USER + ADMIN)
import { ReportsFeedPage } from './pages/reports/feed/page/reports-feed-page/reports-feed-page';
import { ReportDetailPage } from './pages/reports/detail/page/report-detail-page/report-detail-page';
import { ReportFormPage } from './pages/reports/form/page/report-form-page/report-form-page';

// Profile
import { ProfilePage } from './pages/profile/page/profile-page/profile-page';

// Admin
import { AdminUsersListPage } from './pages/admin/users/list/page/admin-users-list-page/admin-users-list-page';
import { AdminUserDetailPage } from './pages/admin/users/detail/page/admin-user-detail-page/admin-user-detail-page';

// Guards (los vas a crear después, en notion->angular->guards explico)
import { authGuard } from './core/guards/auth-guard';
import { userOnlyGuard } from './core/guards/user-only-guard';
import { ownerOrAdminGuard } from './core/guards/owner-or-admin-guard';
import { adminGuard } from './core/guards/admin-guard';


export const routes: Routes = [
  //PÚBLICAS
  {path: '', component: LandingPage},
  {path: 'auth', component: AuthPage},

  //REPORTS (USER + ADMIN)
  {path: 'reports', component: ReportsFeedPage, canActivate: [authGuard]},
  {path: 'reports/:id', component: ReportDetailPage, canActivate: [authGuard]},

  //USER: crear
  {path: 'reports/new', component: ReportFormPage, canActivate: [authGuard, userOnlyGuard]},

  //USER DUEÑA o ADMIN
  {path: 'reports/:id/edit', component: ReportFormPage, canActivate: [authGuard, ownerOrAdminGuard]},

  //PROFILE (USER + ADMIN)
  {path: 'profile', component: ProfilePage, canActivate: [authGuard]},

  //ADMIN
  {path: 'admin/users', component: AdminUsersListPage, canActivate: [authGuard, adminGuard]},
  {path: 'admin/users/:id', component: AdminUserDetailPage, canActivate: [authGuard, adminGuard]},

  //404
  {path: '**', redirectTo: ''}  

];

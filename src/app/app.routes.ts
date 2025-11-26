import { Routes } from '@angular/router';
// Páginas públicas
import { LandingPage } from './pages/landing/page/landing-page/landing-page';
import { AuthPage } from './pages/auth/auth-page';

// Reports (USER + ADMIN)
import { ReportsFeedPage } from './pages/reports/feed-page/feed-page';
import { ReportDetailPage } from './pages/reports/report-detail-page/page/report-detail-page/report-detail-page';
import { LayoutPage } from './shared/layout/layout';


// Profile
import { ProfilePage } from './pages/profile/profile-page/profile-page';


// Guards 
import { authGuard } from './core/guards/auth-guard';
import { userOnlyGuard } from './core/guards/user-only-guard';
import { ownerOrAdminGuard } from './core/guards/owner-or-admin-guard';
import { adminGuard } from './core/guards/admin-guard';

//User
import { ReportFormPage } from './pages/reports/report-form-page/report-form-page';
import { MyReportsPage } from './pages/reports/my-reports-page/my-reports-page';

//Admin
import { CategoryManagementPage } from './pages/admin/category-management-page/category-management-page';
import { UserListPage } from './pages/admin/user-list-page/user-list-page';
import { UserDetailPage } from './pages/admin/user-detail-page/user-detail-page';






export const routes: Routes = [
  // PÚBLICAS
  {path: '', component: LandingPage},
  {path: 'auth', component: AuthPage},

  // RUTAS PROTEGIDAS (con layout)
  {
    path: 'app',
    component: LayoutPage,
    canActivate: [authGuard],
    children: [
      {path: 'reports', component: ReportsFeedPage},                                             // /app/reports
      {path: 'reports/my', component: MyReportsPage},                                            // /app/reports/my
      {path: 'reports/new', component: ReportFormPage, canActivate: [userOnlyGuard]},            // /app/reports/new
      {path: 'reports/:id/edit', component: ReportFormPage, canActivate: [ownerOrAdminGuard]},    // /app/reports/:id/edit
      {path: 'reports/:id', component: ReportDetailPage},                                        // /app/reports/:id      
      {path: 'profile', component: ProfilePage},                                                 // /app/profile
      {path: 'admin/users', component: UserListPage, canActivate: [adminGuard]},                 // /app/admin/users
      {path: 'admin/users/:id', component: UserDetailPage, canActivate: [adminGuard]},            // /app/admin/users/:id
      {path: 'admin/categories', component: CategoryManagementPage, canActivate: [adminGuard]},
    ]
  },
  
  // 404
  {path: '**', redirectTo: ''} 

];

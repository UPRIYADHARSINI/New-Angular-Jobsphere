import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserRegistrationComponent } from './user-register/user-register.component';
import { RecruiterRegistrationComponent } from './recruiter-register/recruiter-register.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { RecruiterLoginComponent } from './recruiter-login/recruiter-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PostJobHomeComponent } from './post-job-home/post-job-home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'user-register', loadComponent: () => import('./user-register/user-register.component').then(m => m.UserRegistrationComponent) },
  { path: 'recruiter-register', loadComponent: () => import('./recruiter-register/recruiter-register.component').then(m => m.RecruiterRegistrationComponent) },
  { path: 'user-login', loadComponent: () => import('./user-login/user-login.component').then(m => m.UserLoginComponent) },
  { path: 'recruiter-login', loadComponent: () => import('./recruiter-login/recruiter-login.component').then(m => m.RecruiterLoginComponent) },
  { path: 'admin-login', loadComponent: () => import('./admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin-home', loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent) }, // Added admin-home route
  { path: 'user-home', loadComponent: () => import('./user-home/user-home.component').then(m => m.UserHomeComponent) },
  { path: 'recruiter-home', loadComponent: () => import('./recruiter-home/recruiter-home.component').then(m => m.RecruiterHomeComponent) },
  { path: 'user-profile', loadComponent: () => import('./user-profile/user-profile.component').then(m => m.UserProfileComponent) },
  { path: 'recruiter-profile', loadComponent: () => import('./recruiter-profile/recruiter-profile.component').then(m => m.RecruiterProfileComponent) },
  { path: 'post-job-home', loadComponent: () => import('./post-job-home/post-job-home.component').then(m => m.PostJobHomeComponent) },
  { path: 'user-applied-jobs', loadComponent: () => import('./user-applied-jobs/user-applied-jobs.component').then(m => m.UserAppliedJobsComponent) },
  { path: 'admin-home', loadComponent: () => import('./admin-home/admin-home.component').then(m => m.AdminHomeComponent) },
  { path: '**', redirectTo: '/home' } // Added wildcard route for unmatched paths
];
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ArchiveComponent } from './pages/archive/archive.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { TopicsComponent } from './pages/topics/topics.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
{
  path: '',
  component: HomeComponent
},
{
  path: 'login',
  component: LoginComponent,
  canActivate: [guestGuard]
},
{
  path: 'sign-up',
  component: SignupComponent,
  canActivate: [guestGuard]
},
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
},
{
  path: 'archive',
  component: ArchiveComponent,
  canActivate: [authGuard]
},
{
  path: 'archive/:id',
  component: ArticleDetailComponent,
  canActivate: [authGuard]
},
{
  path: 'topics',
  component: TopicsComponent,
  canActivate: [authGuard]
}
];

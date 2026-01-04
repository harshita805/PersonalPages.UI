import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateJournalComponent } from './journal/create-journal.component';
import { MyJournalsComponent } from './journal/my-journals.component';
import { CommunityComponent } from './community/community.component';
import { MoodComponent } from './mood/mood.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'journal/create', component: CreateJournalComponent,
    canActivate: [authGuard]
  },
  {
    path: 'journal/my', component: MyJournalsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'community', component: CommunityComponent,
    canActivate: [authGuard]
  },
  {
    path: 'mood', component: MoodComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [authGuard]
  }
];

import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateJournalComponent } from './journal/create-journal.component';
import { MyJournalsComponent } from './journal/my-journals.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { moodDialogResolver } from './mood/mood-dialog.resolver';
import { MoodDialogComponent } from './mood/mood-dialog.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    resolve: {
      mood: moodDialogResolver   // ✅ RESOLVER ADDED
    },
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
    path: 'mood', component: MoodDialogComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [authGuard]
  }
];

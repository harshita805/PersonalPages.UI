import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { CommunityComponent } from './community/community.component';
import { authGuard } from './guards/auth.guard';
import { CreateJournalComponent } from './journal/create-journal.component';
import { MyJournalsComponent } from './journal/my-journals.component';
import { MoodDialogComponent } from './mood/mood-dialog.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'community', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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

import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommunityComponent } from '../community/community.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CommunityComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl:'./dashboard.component.css'
})
export class DashboardComponent { }

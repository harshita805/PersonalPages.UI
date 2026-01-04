import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './community.component.html'
})
export class CommunityComponent {
  posts = [
    { title: 'A Beautiful Day', content: 'Feeling positive today' },
    { title: 'Poem', content: 'Words from the heart' }
  ];
}

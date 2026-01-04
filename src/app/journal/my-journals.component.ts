import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './my-journals.component.html'
})
export class MyJournalsComponent {
  journals = [
    { title: 'My First Entry', mood: 'Happy' },
    { title: 'Learning Angular', mood: 'Excited' }
  ];
}

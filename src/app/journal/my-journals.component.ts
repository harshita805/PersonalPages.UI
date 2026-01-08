import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JournalService } from '../services/journal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  templateUrl: './my-journals.component.html'
})
export class MyJournalsComponent implements OnInit {

  private journalService = inject(JournalService);
  journals: any[] = [];

  ngOnInit() {
    this.journalService.getMyJournals()
      .subscribe(data => this.journals = data);
  }
}

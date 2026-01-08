import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JournalService } from '../services/journal.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  templateUrl: './community.component.html'
})
export class CommunityComponent implements OnInit {

  private journalService = inject(JournalService);
  journals: any[] = [];

  ngOnInit() {
    this.journalService.getPublicJournals()
      .subscribe(data => this.journals = data);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JournalService {
  api = 'https://localhost:5001/api/journal';

  constructor(private http: HttpClient) {}

  getEntries() {
    return this.http.get(this.api);
  }
}

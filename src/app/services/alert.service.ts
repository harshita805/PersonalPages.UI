import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AlertMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<AlertMessage | null>();
  alert$ = this.alertSubject.asObservable();

  show(text: string, type: 'success' | 'error' | 'info' = 'success') {
    this.alertSubject.next({ text, type });

    setTimeout(() => {
      this.alertSubject.next(null);
    }, 3000);
  }
}
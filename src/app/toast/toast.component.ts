import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertMessage, AlertService } from '../services/alert.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="alert"
         class="custom-toast"
         [ngClass]="alert.type">
      {{ alert.text }}
    </div>
  `,
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {

  private alertService = inject(AlertService);
  alert: AlertMessage | null = null;

  constructor() {
    this.alertService.alert$.subscribe(message => {
      this.alert = message;
    });
  }
}
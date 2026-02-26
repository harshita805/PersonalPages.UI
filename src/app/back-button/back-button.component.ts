import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent {

  #router = inject(Router);

  goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.#router.navigate(['/']);
    }
  }
}
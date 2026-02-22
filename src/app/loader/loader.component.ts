import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../shared/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  loader = inject(LoaderService);
}

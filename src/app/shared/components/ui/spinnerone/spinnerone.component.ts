import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'appspinnerone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-container">
      <div class="spinner-border text-primary spinner-lg" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <span *ngIf="showText()" class="ms-2 spinner-text">{{ text() }}</span>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .spinner-lg {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class SpinneroneComponent {
  text = input<string>("hi");
  showText = input<boolean>(true);
}
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentCardComponent } from './shared/components/common/component-card/component-card.component';
import { AlertComponent } from './shared/components/ui/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Zed-Admin';
  
}

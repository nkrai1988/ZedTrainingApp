import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './app-footer.component.html',
})
export class AppFooterComponent {
  @Input() moduleLabel = 'Training & Capacity Building';
}


import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-component-card',
  imports: [RouterModule],
  templateUrl: './component-card.component.html',
  styles: ``
})
export class ComponentCardComponent {

  @Input() title!: string;
  @Input() desc: string = '';
  @Input() className: string = '';
  @Input() headerclsName: string = '';
  @Input() backUrl: string = '';
  @Input() backLabel: string = 'Back';
  @Input() showBack: boolean = false;
  @Output() backClick = new EventEmitter<void>();
}

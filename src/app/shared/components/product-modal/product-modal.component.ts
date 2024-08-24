import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Inventory } from '../../../core/models/interfaces/api/inventory';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './product-modal.component.html'
})
export class ProductModalComponent {
  @Input() product: Inventory | null = null;
  @Output() close = new EventEmitter<void>();
  fasTimes = faTimes

  closeModal() {
    this.close.emit();
  }
}

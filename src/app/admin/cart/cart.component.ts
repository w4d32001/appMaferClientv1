import { Inventory, InventoryResponse } from './../../core/models/interfaces/api/inventory';
import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { Cart } from '../../core/models/cart';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/api/product.service';
import { NotifyService } from '../../core/interceptors/notify.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent {

  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private notify = inject(NotifyService);
  private router = inject(Router);

  cartItems: Cart[] = [];
  inventories: Record<number, number> = {}; 

  constructor() {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.loadInventories();
    });
  }

  loadInventories(): void {
    this.productService.getInventories().subscribe((response: InventoryResponse) => {
      const inventories = response.data.inventories;

      this.inventories = inventories.reduce((acc: Record<number, number>, item: Inventory) => {
        acc[item.detailed_product_id] = item.stock;
        return acc;
      }, {});
    });
  }

  updateQuantity(item: Cart, quantity: number): void {
    const availableStock = this.inventories[item.id];

    if (quantity <= 0) {
      this.removeItem(item);
    } else if (quantity > availableStock) {
      this.notify.showErrorToast(`La cantidad máxima disponible para ${item.name} es ${availableStock}`);
    } else {
      this.cartService.updateQuantity(item.name, quantity);
    }
  }

  removeItem(item: Cart): void {
    this.cartService.removeFromCart(item.name);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  checkQuantitiesBeforeRedirect(): void {
    const hasZeroQuantity = this.cartItems.some(item => item.quantity <= 0);

    if (hasZeroQuantity) {
      this.notify.showErrorToast('Hay artículos en el carrito con cantidad cero. Por favor, actualiza las cantidades.');
    } else {
      this.router.navigate(['admin/shopping'])
    }
  }
}

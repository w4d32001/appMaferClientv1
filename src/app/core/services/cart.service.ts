import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItemsSubject = new BehaviorSubject<Cart[]>(this.getCartItems());
  cartItems$ = this.cartItemsSubject.asObservable();

  private getCartItems(): Cart[] {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  }

  addToCart(item: Cart): void {
    const items = this.getCartItems();
    const existingItem = items.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      items.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  updateQuantity(name: string, quantity: number): void {
    const items = this.getCartItems();
    const item = items.find(i => i.name === name);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem('cartItems', JSON.stringify(items));
      this.cartItemsSubject.next(items);
    }
  }

  removeFromCart(name: string): void {
    const items = this.getCartItems().filter(i => i.name !== name);
    localStorage.setItem('cartItems', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }
  clearCart(): void {
    localStorage.removeItem('cartItems');
    this.cartItemsSubject.next([]);
  }
}

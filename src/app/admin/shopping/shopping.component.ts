import { PaymentHeaderComponent } from './../../shared/components/payment-header/payment-header.component';
import { Component, inject } from '@angular/core';
import { Cart } from '../../core/models/cart';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/api/payment.service';
import { Payment, PaymentResponse } from '../../core/models/interfaces/api/payment';
import { AuthService } from '../../core/services/auth/auth.service';
import { Customer } from '../../core/models/interfaces/api/customer';
import { SaleService } from '../../core/services/api/sale.service';
import { Sale } from '../../core/models/interfaces/api/sale';
import { NotifyService } from '../../core/interceptors/notify.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaymentFormComponentComponent } from '../../shared/components/payment-form-component/payment-form-component.component';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentFormComponentComponent, PaymentHeaderComponent],
  templateUrl: './shopping.component.html'
})
export class ShoppingComponent {

  private paymentService = inject(PaymentService)
  private authService = inject(AuthService)
  private saleService = inject(SaleService)
  private notify = inject(NotifyService)
  private router = inject(Router)

  cartItems: Cart[] = [];
  paymentMethod: string = '';
  totalAmount: number = 0;
  payments: Payment[] = []
  user!: Customer
  private notificationSent = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
    this.getPayments()
    this.getUser()
  }

  getUser(){
    this.user = this.authService.getCurrentUser()
  }

  getPayments(){
    this.paymentService.getPayments().subscribe(
      (response: PaymentResponse) => {
        this.payments = response.data
      }
    )
  }

  updateQuantity(item: Cart, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
    } else {
      this.cartService.updateQuantity(item.name, quantity);
      this.calculateTotal();
    }
  }

  removeItem(item: Cart): void {
    this.cartService.removeFromCart(item.name);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  handlePayment(): void {
    console.log('Payment method:', this.paymentMethod);
    console.log('Total amount:', this.totalAmount);
  }

  onChange(){
    const saleRequests = this.cartItems.map(item => {
      const sale = {
        customer_id: this.user.id,
        inventory_id: item.id,
        payment_method_id: Number(this.paymentMethod),
        total_quantity: item.quantity,
        total_sale: item.price * item.quantity
      };

      console.log('Enviando datos de venta:', sale);

      return this.saleService.createSale(sale).pipe(
        // Add a catchError here if you want to handle errors individually
      );
    });

    forkJoin(saleRequests).subscribe(
      (responses) => {
        if (!this.notificationSent) {
          this.notify.showSuccessToast('Ventas procesadas correctamente');
          this.notificationSent = true;
        }
        this.cartService.clearCart();
        this.router.navigate(['/admin/']); 
      },
      (error) => {
        this.notify.showErrorToast('Error al procesar ventas');
        console.error('Error en el procesamiento de ventas:', error);
      }
    );
  }

  }



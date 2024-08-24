import { Order, OrderResponse } from './../../core/models/interfaces/api/order';
import { SaleService } from './../../core/services/api/sale.service';
import { Component, inject } from '@angular/core';
import { LocationService } from '../../core/services/api/location.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { Customer } from '../../core/models/interfaces/api/customer';
import { groupBy } from 'rxjs';
import { OrderService } from '../../core/services/api/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order.component.html'
})
export class OrderComponent {
  
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  user!: Customer;
  orders: Order[] = []; 

  ngOnInit(): void {
    this.getUser();
    this.getOrders();
  }

  getUser(): void {
    this.user = this.auth.getCurrentUser();
  }

  getOrders(): void {
    this.orderService.getOrder(this.user.id).subscribe(
      (response: OrderResponse) => {
        this.orders = response.data;
        console.log(this.orders)
      },
      error => {
        console.error('Error al cargar ventas:', error);
      }
    );
  }

  
  
}

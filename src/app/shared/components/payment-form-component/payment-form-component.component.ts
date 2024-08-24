import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import KRGlue from '@lyracom/embedded-form-glue';
import { PaymentService } from '../../../core/services/payment.service';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, retry, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Customer } from '../../../core/models/interfaces/api/customer';
import { SaleService } from '../../../core/services/api/sale.service';
import { NotifyService } from '../../../core/interceptors/notify.service';
import { Router } from '@angular/router';
import { Cart } from '../../../core/models/cart';
import { CartService } from '../../../core/services/cart.service';
@Component({
  selector: 'app-payment-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-form-component.component.html',
  styleUrl: './payment-form-component.component.css'
})
export class PaymentFormComponentComponent implements AfterViewInit {
  orderDetails: string = '';
  @Input() amount: number = 0
  

  private authService = inject(AuthService)
  
  private saleService = inject(SaleService)
  private notify = inject(NotifyService)
  private router = inject(Router)
  private cartService = inject(CartService)

  cartItems: Cart[] = [];
  
  private notificationSent = false;

  user!: Customer
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      console.log(items)
    });
    this.getUser()
  }

  getUser(){
    this.user = this.authService.getCurrentUser()
  }

 
    message: string = '';
    paid: boolean = false;
  
    constructor(private http: HttpClient, private chRef: ChangeDetectorRef) { }
  
    async ngAfterViewInit() {
      let endpoint: string = '';
      let publicKey: string = '';
      let formToken: string = '';

      const total = this.amount * 100
  
      try {
        const resp: any = await this.http.post('http://127.0.0.1:8000/api/checkout', { amount: total, currency: 'PEN' }).pipe(
          retry(3),
          catchError((error) => {
            console.error('Error en la solicitud:', error);
            return throwError(error);
          })
        ).toPromise();
        endpoint = resp.endpoint;
        publicKey = resp.publickey;
        formToken = resp.formToken;
  
        const { KR } = await KRGlue.loadLibrary(endpoint, publicKey);
        await KR.setFormConfig({ formToken: formToken });
        console.log(KR)
        await KR.onSubmit(this.onSubmit);
        await KR.renderElements('#myPaymentForm');
        //redirigir si el págo es exitoso
      } catch (error: any) {
        this.message = error.message + ' (see console for more details)';
      }
      
    }
  
  
    private onSubmit = async (paymentData: KRPaymentResponse): Promise<boolean> => {
      try {
        const response: any = await this.http.post('http://127.0.0.1:8000/api/validate', paymentData, { responseType: 'text' }).toPromise();
        if (response) {
          this.paid = true;
          this.chRef.detectChanges();
          const saleRequests = this.cartItems.map(item => {
            const sale = {
              customer_id: this.user.id,
              inventory_id: item.id,
              payment_method_id: 2,
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
              this.router.navigate(['/admin/']).then(() => {
                window.location.reload(); // Recargar la página
              });
            },
            (error) => {
              this.notify.showErrorToast('Error al procesar ventas');
              console.error('Error en el procesamiento de ventas:', error);
            }
          );
          return true; 
        }
        return false; 
      } catch (error) {
        return false; 
      }
    }
    
    
}

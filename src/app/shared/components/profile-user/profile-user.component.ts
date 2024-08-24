import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Customer, CustomerResponse } from '../../../core/models/interfaces/api/customer';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/api/client.service';

@Component({
  selector: 'app-profile-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-user.component.html'
})
export class ProfileUserComponent {

  private authService = inject(AuthService)
  private clientService = inject(ClientService)

  user!: Customer

  client: Customer = {
    id: 0,
    name: '',
    surname: '',
    dni: '',
    ruc: '',
    reason: '',
    image: '',
    address: '',
    email: '',
    password: '',
    phone: '',
  };

  getUser(){
    this.user = this.authService.getCurrentUser()
  }
  
  ngOnInit(){
    this.getUser()
    this.getClient()
  }
  getClient() {
    this.clientService
      .getCustomer(this.user.id)
      .subscribe(
        (response: CustomerResponse) => {
        this.client = response.data;
      })
  }

}

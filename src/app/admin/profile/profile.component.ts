import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Customer, CustomerResponse, ResponseCustomer } from '../../core/models/interfaces/api/customer';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faArrowRight, faClose, faPerson, faReorder } from '@fortawesome/free-solid-svg-icons';
import { ClientService } from '../../core/services/api/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FontAwesomeModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {

  private authService = inject(AuthService)
  private clientService = inject(ClientService)

  faArrowRight = faArrowRight
  faPerson = faPerson
  faAddress = faAddressCard
  faOrder = faReorder
  faExit = faClose

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

  
  logout(event: Event): void {
    event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Se cerrará tu sesión!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout()
      }
    });
  }

  user!: Customer

  loadUser(){
    this.user = this.authService.getCurrentUser()
  }
  ngOnInit(){
    this.loadUser()
    this.loadClient()
  }

  loadClient(){
    this.clientService.getCustomer(this.user.id).subscribe(
      (response: CustomerResponse) => {
        this.client = response.data
      }
    )
  }

}

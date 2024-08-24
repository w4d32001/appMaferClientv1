import { Component, inject } from '@angular/core';
import { FormControlComponent } from '../../shared/components/form-control/form-control.component';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorComponent } from '../../shared/components/validation-error/validation-error.component';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/api/client.service';
import { NotifyService } from '../../core/interceptors/notify.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormControlComponent, ReactiveFormsModule, ValidationErrorComponent, RouterLink, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  rucInput: string = '';

  private clientService = inject(ClientService)
  private notify = inject(NotifyService)

  get nameFb() {
    return this.registerForm.controls['name'];
  }
  get surnameFb() {
    return this.registerForm.controls['surname'];
  }
  get dniFb() {
    return this.registerForm.controls['dni'];
  }
  get rucFb() {
    return this.registerForm.controls['ruc'];
  }
  get customer_type_idFb() {
    return this.registerForm.controls['customer_type_id'];
  }
  get reasonFb() {
    return this.registerForm.controls['reason'];
  }
  get addressFb() {
    return this.registerForm.controls['address'];
  }
  get emailFb() {
    return this.registerForm.controls['email'];
  }
  get passwordFb() {
    return this.registerForm.controls['password'];
  }
  get phoneFb() {
    return this.registerForm.controls['phone'];
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      dni: [null, [Validators.required, Validators.pattern(/^\d{8}$/)]], 
      ruc: [null, [ Validators.pattern(/^\d{11}$/)]],
      reason: [null, []],
      address: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]], 
      password: [null, [Validators.required, Validators.minLength(6)]], 
      phone: [null, [Validators.required, Validators.pattern(/^\d{9}$/)]] 
    });
  }

  onSubmit(): void {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      this.registerForm.markAsDirty();
      return;
    }
    this.clientService.createCustomer(this.registerForm.value).subscribe(
      (response) => {
        console.log(response.message)
        this.notify.showSuccessToast(response.message)
        setTimeout(() => {
          this.router.navigate(['auth/']);
        }, 2000);
      },
      (error) => {
        this.notify.showErrorToast(error.error.message)

      }
    )
  }

  buscarRUC() {
    if (this.rucInput.trim() !== '') {
      this.clientService.getClientRUC(this.rucInput).subscribe(
        (response: any) => {
          if (response) {
            this.registerForm.patchValue({
              ruc: response.numeroDocumento,
              name: response.razonSocial,
              phone: '',
              email: '',
              address: response.direccion,
              reason: response.razonSocial,
            });
          } else {
            this.notify.showErrorToast(
              'No se encontraron datos para el RUC ingresado.'
            );
          }
        },
        (error) => {
          this.notify.showErrorToast(
            'Ocurrió un error al buscar el RUC.'
          );
        }
      );
    }
  }
}

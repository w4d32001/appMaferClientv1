import {
  Customer,
  CustomerResponse,
} from './../../../core/models/interfaces/api/customer';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ClientService } from '../../../core/services/api/client.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotifyService } from '../../../core/interceptors/notify.service';
import { ValidationErrorComponent } from '../validation-error/validation-error.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, ValidationErrorComponent],
  templateUrl: './update-user.component.html',
})
export class UpdateUserComponent {
  private authService = inject(AuthService);
  private clientService = inject(ClientService);
  private notify = inject(NotifyService)
  private router = inject(Router)

  updateForm!: FormGroup;

  user!: Customer;
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

  ngOnInit() {
    this.getUser()
    this.getClient()
  }
  get nameFb() {
    return this.updateForm.controls['name']
  }
  get surnameFb() {
    return this.updateForm.controls['surname']
  }
  get dniFb() {
    return this.updateForm.controls['dni']
  }
  get rucFb() {
    return this.updateForm.controls['ruc']
  }
  get reasonFb() {
    return this.updateForm.controls['reason']
  }
  get imageFb() {
    return this.updateForm.controls['image']
  }
  get emailFb() {
    return this.updateForm.controls['email']
  }
  get phoneFb() {
    return this.updateForm.controls['phone']
  }

  constructor(private fb: FormBuilder) {
    this.updateForm = fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      surname: [null, [Validators.required, Validators.minLength(3)]],
      dni: [null, [Validators.required, Validators.pattern(/^\d{8}$/), Validators.minLength(8), Validators.maxLength(8)]],
      ruc: [null, [Validators.minLength(11), Validators.maxLength(11)]],
      reason: [null, []],
      image: [null, []],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^\d{9}$/), Validators.minLength(9), Validators.maxLength(9)]],
    });
  }

  getUser() {
    this.user = this.authService.getCurrentUser();
  }

  getClient() {
    this.clientService
      .getCustomer(this.user.id)
      .subscribe((response: CustomerResponse) => {
        this.client = response.data;
        this.updateForm.patchValue({
          name: this.client.name,
          surname: this.client.surname,
          dni: this.client.dni,
          ruc: this.client.ruc,
          reason: this.client.reason,
          email: this.client.email,
          phone: this.client.phone,
        })
        if (this.client.image) {
          this.imagePreview = this.client.image;
        }
      });
  }

  onSubmit() {
    if (!this.updateForm.valid) {
      this.updateForm.markAllAsTouched();
      this.updateForm.markAsDirty();
      return;
    }
    console.log(this.updateForm.value);
    this.clientService.updateCustomer(this.user.id, this.updateForm.value).subscribe(
      (response) => {
        this.notify.showSuccessToast(response.message)
        setTimeout(() => {
          this.router.navigate(['/admin/profile']);
        }, 0);
      },
      (error)=> {
        console.log(error)
      }
    )
  }
  
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;

  captureImg(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          this.updateForm.patchValue({ image: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
        this.updateForm.patchValue({ image: null });
        this.notify.showErrorToast("Por favor ingrese un archivo de tipo imagen válido (JPEG, PNG, GIF, WEBP)");
      }
    } else {
      this.imagePreview = null;
      this.updateForm.patchValue({ image: null });
      this.notify.showErrorToast("Por favor seleccione un archivo");
    }
  }
}

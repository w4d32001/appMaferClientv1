import { Component, inject } from '@angular/core';
import { LocationService } from '../../../core/services/api/location.service';
import { LoaderComponent } from '../loader/loader.component';
import { Customer, CustomerResponse, ResponseCustomer } from '../../../core/models/interfaces/api/customer';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationErrorComponent } from '../validation-error/validation-error.component';
import { ClientService } from '../../../core/services/api/client.service';
import { NotifyService } from '../../../core/interceptors/notify.service';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [LoaderComponent, ReactiveFormsModule, ValidationErrorComponent],
  templateUrl: './address.component.html',
})
export class AddressComponent {
  private locationService = inject(LocationService);
  private authService = inject(AuthService);
  private clientService = inject(ClientService)
  private notify = inject(NotifyService)

  accessToken: string = '';
  departments: any[] = [];
  provinces: any[] = [];
  districts: any[] = [];
  isLoading: boolean = false;
  private intervalId: any;
  showEdit: boolean = false

  ngOnInit(): void {
    this.locationService.getAccessToken().subscribe((response) => {
      this.accessToken = response.auth_token;
      this.loadDepartments();
    });
    this.loadUser();
    this.intervalId = setInterval(() => {
      this.loadClient();
    }, 5000);
    
  }
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.locationService
      .getDepartments(this.accessToken)
      .subscribe((response) => {
        this.departments = response;
        this.isLoading = false;
      });
  }

  onDepartmentChange(department: string): void {
    this.isLoading = true;
    if (department) {
      this.locationService
        .getProvinces(this.accessToken, department)
        .subscribe((response) => {
          this.provinces = response;
          this.districts = [];
          this.isLoading = false;
        });
    } else {
      this.provinces = [];
      this.districts = [];
    }
  }

  onProvinceChange(province: string): void {
    this.isLoading = true;
    if (province) {
      this.locationService
        .getDistricts(this.accessToken, province)
        .subscribe((response) => {
          this.districts = response;
          this.isLoading = false;
        });
    } else {
      this.districts = [];
    }
  }

  user!: Customer;

  loadUser() {
    this.user = this.authService.getCurrentUser();
  }

  oneAddressForm!: FormGroup;

  get departmentFb() {
    return this.oneAddressForm.controls['department'];
  }
  get provinceFb() {
    return this.oneAddressForm.controls['province'];
  }
  get districtFb() {
    return this.oneAddressForm.controls['district'];
  }
  get numberFb() {
    return this.oneAddressForm.controls['number'];
  }
  get floorFb() {
    return this.oneAddressForm.controls['floor'];
  }
  get referenceFb() {
    return this.oneAddressForm.controls['reference'];
  }

  constructor(private fb: FormBuilder) {
    this.oneAddressForm = this.fb.group({
      department: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      number: ['', Validators.required],
      floor: [''],
      reference: [''],
    });
  }

  onSubmit(){
    if(!this.oneAddressForm.valid){
      this.oneAddressForm.markAllAsTouched()
      this.oneAddressForm.markAsDirty()
      return
    }
    const { number, floor, reference, ...rest } = this.oneAddressForm.value;
    const additionalInfo = `${number ?? ''}, ${floor ?? ''}, ${reference ?? ''}`.trim();

    const fullAddressData = {
      ...rest,
      additional_info: additionalInfo,
    };

    console.log(fullAddressData);
    this.clientService.updateCustomerAddress(this.user.id, fullAddressData).subscribe(
      (response) => {
        this.notify.showSuccessToast(response.message)
      },
      (error) => {
        this.notify.showErrorToast(error.error)
      }
    )

  }

  client: Customer = {
    id: 0,
    name: "",
    surname: "",
    dni: "",
    ruc: "",
    reason: "",
    image: "",
    address: "",
    email: "",
    password: "",
    phone: ""
  }

  loadClient(){
    this.clientService.getCustomer(this.user.id).subscribe(
      (response: CustomerResponse) =>{
        this.client = response.data
      }
    )
  }
  show(){
    this.showEdit = true
  }

  close(){
    this.showEdit = false
  }

}

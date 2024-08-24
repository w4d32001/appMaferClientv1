import { Component, inject } from '@angular/core';
import { Company } from '../../../core/models/interfaces/api/company';
import { CompanyService } from '../../../core/services/api/company.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping, faPerson } from '@fortawesome/free-solid-svg-icons';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './header-dashboard.component.html'
})
export class HeaderDashboardComponent {
  private companyService = inject(CompanyService)

  company: Company = {
    id: 0,
    name: "",
    description: "",
    img: "",
    address: "",
    phone: ""
  }

  faCartShopping = faCartShopping
  faPerson= faPerson

  getCompany(){
    this.companyService.getCompany(1).subscribe(
      (response) => {
        this.company = response.data
      }
    )
  }

  ngOnInit(){
    this.getCompany()
  }
}

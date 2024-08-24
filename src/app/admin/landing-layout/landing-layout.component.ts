import { Component, inject } from '@angular/core';
import { HeaderLandingComponent } from '../../shared/components/header-landing/header-landing.component';
import { FooterLandingComponent } from '../../shared/components/footer-landing/footer-landing.component';
import { CompanyService } from '../../core/services/api/company.service';
import { Company, CompanyResponse } from '../../core/models/interfaces/api/company';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [HeaderLandingComponent, FooterLandingComponent, CarouselComponent, RouterLink],
  templateUrl: './landing-layout.component.html'
})
export class LandingLayoutComponent {

  private companyService = inject(CompanyService)

  company: Company = {
    id: 0,
    name: "",
    description: "",
    img: "",
    address: "",
    phone: ""
  }
 

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

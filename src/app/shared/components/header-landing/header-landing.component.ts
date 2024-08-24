import { Component, ElementRef, HostListener, inject, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Company } from '../../../core/models/interfaces/api/company';
import { CompanyService } from '../../../core/services/api/company.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-landing.component.html'
})
export class HeaderLandingComponent {
  @ViewChild('header', { static: true }) header!: ElementRef;
  @ViewChild('navcontent', { static: true }) navcontent!: ElementRef;
  @ViewChild('navaction', { static: true }) navaction!: ElementRef;
  @ViewChildren('toggleColour') toToggle!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) { }

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

  ngOnInit(): void {
    this.updateHeaderStyles();
    this.getCompany()
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.updateHeaderStyles();
  }

  private updateHeaderStyles() {
    const scrollpos = window.scrollY;

    if (scrollpos > 20) {
      this.renderer.removeClass(this.header.nativeElement, 'bg-gradient');
      this.renderer.addClass(this.header.nativeElement, 'bg-white');
      this.renderer.removeClass(this.navaction.nativeElement, 'bg-white');
      this.renderer.addClass(this.navaction.nativeElement, 'bg-white');
      this.renderer.removeClass(this.navaction.nativeElement, 'text-gray-800');
      this.renderer.addClass(this.navaction.nativeElement, 'text-black');

      // Verificar si toToggle no está vacío
      if (this.toToggle) {
        this.toToggle.forEach(element => {
          this.renderer.addClass(element.nativeElement, 'text-gray-800');
          this.renderer.removeClass(element.nativeElement, 'text-white');
        });
      }

      this.renderer.addClass(this.header.nativeElement, 'shadow');
      this.renderer.removeClass(this.navcontent.nativeElement, 'bg-gray-100');
      this.renderer.addClass(this.navcontent.nativeElement, 'bg-white');
    } else {
      this.renderer.addClass(this.header.nativeElement, 'bg-gradient');
      this.renderer.removeClass(this.header.nativeElement, 'bg-white');
      this.renderer.removeClass(this.navaction.nativeElement, 'gradient');
      this.renderer.addClass(this.navaction.nativeElement, 'bg-white');
      this.renderer.removeClass(this.navaction.nativeElement, 'text-white');
      this.renderer.addClass(this.navaction.nativeElement, 'text-gray-800');

      // Verificar si toToggle no está vacío
      if (this.toToggle) {
        this.toToggle.forEach(element => {
          this.renderer.addClass(element.nativeElement, 'text-white');
          this.renderer.removeClass(element.nativeElement, 'text-gray-800');
        });
      }

      this.renderer.removeClass(this.header.nativeElement, 'shadow');
      this.renderer.removeClass(this.navcontent.nativeElement, 'bg-white');
      this.renderer.addClass(this.navcontent.nativeElement, 'bg-gray-100');
    }
  }
}

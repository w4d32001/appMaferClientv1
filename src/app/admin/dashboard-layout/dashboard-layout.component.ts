import { Component } from '@angular/core';
import { HeaderDashboardComponent } from '../../shared/components/header-dashboard/header-dashboard.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [HeaderDashboardComponent, RouterOutlet],
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent {

}

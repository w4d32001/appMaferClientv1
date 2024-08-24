import { Routes } from "@angular/router";
import { DashboardLayoutComponent } from "./dashboard-layout/dashboard-layout.component";
import { ProductsComponent } from "./products/products.component";
import { CartComponent } from "./cart/cart.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { ProfileComponent } from "./profile/profile.component";
import { ProfileUserComponent } from "../shared/components/profile-user/profile-user.component";
import { OrderComponent } from "./order/order.component";
import { AddressComponent } from "../shared/components/address/address.component";
import { UpdateUserComponent } from "../shared/components/update-user/update-user.component";
import { ShoppingComponent } from "./shopping/shopping.component";

export const ADMIN_ROUTES: Routes = [
    {
        path: '', component: DashboardLayoutComponent, children: [
            {
                path: '', component: ProductsComponent,
            },
            {
                path: 'cart', component: CartComponent, canActivate: [AuthGuard]
            },
            {
                path: 'profile', component: ProfileComponent, children: [
                    {
                        path: '', component: ProfileUserComponent, canActivate: [AuthGuard]
                    },
                    {
                        path: 'order', component: OrderComponent, canActivate: [AuthGuard]
                    },
                    {
                        path: 'address', component: AddressComponent, canActivate: [AuthGuard]
                    },
                    {
                        path: 'updateUser', component: UpdateUserComponent, canActivate: [AuthGuard]
                    }
                ]
            },
            {
                path: 'shopping', component: ShoppingComponent, canActivate: [AuthGuard]
            },
            {
                path: 'order', component:OrderComponent, canActivate: [AuthGuard]
            }
           
        ]
    }
]
import { Component, inject } from '@angular/core';
import { ProductService } from '../../core/services/api/product.service';
import { Category, Inventory, InventoryResponse } from '../../core/models/interfaces/api/inventory';
import { CardComponent } from '../../shared/components/card/card.component';
import { ProductModalComponent } from '../../shared/components/product-modal/product-modal.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CardComponent, ProductModalComponent, FormsModule, LoaderComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent {

  private productService = inject(ProductService)

  products: Inventory[] = []
  filteredProducts: Inventory[] = []
  selectedProduct: Inventory | null = null
  categories: Category[] = []
  selectedCategoryId: string = ''
  isLoading: boolean = false

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true
    this.productService.getInventories().subscribe(
      (response: InventoryResponse) => {
        this.products = response.data.inventories
        this.filteredProducts = [...this.products] 
        this.categories = response.data.categories
        this.isLoading = false
      }
    )
  }

  filterProducts() {
    if (this.selectedCategoryId) {
      this.filteredProducts = this.products.filter(product => product.category.id === parseInt(this.selectedCategoryId, 10))
    } else {
      this.filteredProducts = [...this.products] 
    }
  }

  openModal(product: Inventory) {
    this.selectedProduct = product
  }

  closeModal() {
    this.selectedProduct = null
  }

  trackByProductId(index: number, item: Inventory) {
    return item.id
  }

  trackByCategoryId(index: number, item: Category) {
    return item.id
  }


}

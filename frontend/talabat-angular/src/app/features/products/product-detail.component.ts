import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProductsService } from '@core/services/products.service';
import { BasketService } from '@core/services/basket.service';
import { Product } from '@core/models/models';
import { resolveImageUrl, FALLBACK_IMAGE } from '@core/services/image.util';
import { ProductCardComponent } from '@shared/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ButtonModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productsSvc = inject(ProductsService);
  private readonly basketSvc = inject(BasketService);
  private readonly messages = inject(MessageService);

  readonly id = this.route.snapshot.paramMap.get('id')!;
  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly qty = signal(1);

  constructor() {
    this.productsSvc.getById(this.id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.productsSvc.getAll({ pageIndex: 1, pageSize: 4 }).subscribe((res) => this.related.set(res.data));
  }

  get img(): string {
    return resolveImageUrl(this.product()?.pictureUrl);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_IMAGE;
  }

  decrease() {
    this.qty.update((q) => Math.max(1, q - 1));
  }

  increase() {
    this.qty.update((q) => q + 1);
  }

  add() {
    const p = this.product();
    if (!p) return;
    this.basketSvc.addProduct(p, this.qty()).subscribe(() => {
      this.messages.add({ severity: 'success', summary: `Added ${this.qty()} × ${p.name}` });
    });
  }
}

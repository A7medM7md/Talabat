import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { Product } from '@core/models/models';
import { BasketService } from '@core/services/basket.service';
import { resolveImageUrl, FALLBACK_IMAGE } from '@core/services/image.util';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/products', product.id]"
      class="group card-hover flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-card"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          [src]="img"
          [alt]="product.name"
          loading="lazy"
          (error)="onImgError($event)"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span class="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-semibold flex items-center gap-1">
          <lucide-icon name="star" [size]="12" class="fill-warning text-warning" /> 4.{{ (product.id % 9) + 1 }}
        </span>
      </div>
      <div class="p-4 flex flex-col gap-2 flex-1">
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span class="font-medium text-foreground">{{ product.productBrand }}</span>
          <span>•</span>
          <span>{{ product.productType }}</span>
        </div>
        <h3 class="font-semibold line-clamp-1">{{ product.name }}</h3>
        <p class="text-xs text-muted-foreground line-clamp-2 flex-1">{{ product.description }}</p>
        <div class="flex items-center justify-between pt-2">
          <div class="font-bold text-lg">
            {{ product.price.toFixed(2) }} <span class="text-xs text-muted-foreground font-normal">AED</span>
          </div>
          <button
            (click)="addToBasket($event)"
            class="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-brand hover:bg-primary-hover transition"
            aria-label="Add to cart"
          >
            <lucide-icon name="plus" [size]="16" />
          </button>
        </div>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly basketSvc = inject(BasketService);
  private readonly messages = inject(MessageService);

  get img(): string {
    return resolveImageUrl(this.product.pictureUrl);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = FALLBACK_IMAGE;
  }

  addToBasket(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.basketSvc.addProduct(this.product).subscribe(() => {
      this.messages.add({ severity: 'success', summary: `${this.product.name} added to cart` });
    });
  }
}

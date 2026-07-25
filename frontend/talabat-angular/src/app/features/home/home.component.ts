import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/models/models';
import { ProductCardComponent } from '@shared/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '@shared/product-card/product-card-skeleton.component';

interface NamedItem {
  id: number | string;
  name: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ProductCardComponent, ProductCardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly productsSvc = inject(ProductsService);

  readonly types = signal<NamedItem[]>([]);
  readonly brands = signal<NamedItem[]>([]);
  readonly featured = signal<Product[] | null>(null);
  readonly loadingFeatured = signal(true);

  ngOnInit(): void {
    this.productsSvc.getTypes().subscribe((t) => this.types.set(ProductsService.normalize(t)));
    this.productsSvc.getBrands().subscribe((b) => this.brands.set(ProductsService.normalize(b)));
    this.productsSvc.getAll({ pageIndex: 1, pageSize: 8 }).subscribe({
      next: (res) => {
        this.featured.set(res.data);
        this.loadingFeatured.set(false);
      },
      error: () => this.loadingFeatured.set(false),
    });
  }
}

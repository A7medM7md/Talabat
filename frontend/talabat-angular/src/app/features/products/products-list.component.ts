import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '@core/services/products.service';
import { Product } from '@core/models/models';
import { ProductCardComponent } from '@shared/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '@shared/product-card/product-card-skeleton.component';

interface NamedItem {
  id: number | string;
  name: string;
}

const PAGE_SIZE = 12;

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LucideAngularModule,
    SelectModule,
    ButtonModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsSvc = inject(ProductsService);

  readonly sortOptions = [
    { label: 'Sort: Featured', value: null },
    { label: 'Price: Low to High', value: 'PriceAsc' },
    { label: 'Price: High to Low', value: 'PriceDesc' },
    { label: 'Name (A–Z)', value: 'name' },
  ];

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly typeId = computed(() => this.numParam('typeId'));
  readonly brandId = computed(() => this.numParam('brandId'));
  readonly sort = computed(() => this.queryParams().get('sort'));
  readonly pageIndex = computed(() => this.numParam('pageIndex') ?? 1);
  readonly view = computed<'grid' | 'list'>(() => (this.queryParams().get('view') === 'list' ? 'list' : 'grid'));

  readonly types = signal<NamedItem[]>([]);
  readonly brands = signal<NamedItem[]>([]);
  readonly products = signal<Product[] | null>(null);
  readonly totalCount = signal(0);
  readonly loading = signal(true);

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / PAGE_SIZE)));

  constructor() {
    this.productsSvc.getTypes().subscribe((t) => this.types.set(ProductsService.normalize(t)));
    this.productsSvc.getBrands().subscribe((b) => this.brands.set(ProductsService.normalize(b)));

    // Re-fetch whenever any relevant query param changes.
    this.route.queryParamMap.subscribe(() => this.loadProducts());
  }

  private numParam(key: string): number | undefined {
    const raw = this.queryParams().get(key);
    return raw ? Number(raw) : undefined;
  }

  private loadProducts() {
    this.loading.set(true);
    this.productsSvc
      .getAll({
        typeId: this.typeId(),
        brandId: this.brandId(),
        sort: this.sort() ?? undefined,
        pageIndex: this.pageIndex(),
        pageSize: PAGE_SIZE,
      })
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.totalCount.set(res.count);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  private patchQuery(patch: Record<string, unknown>, resetPage = true) {
    const current = { ...this.route.snapshot.queryParams };
    const next = { ...current, ...patch, pageIndex: resetPage ? 1 : (patch['pageIndex'] ?? current['pageIndex']) };
    this.router.navigate([], { relativeTo: this.route, queryParams: next });
  }

  setSort(sort: string | null) {
    this.patchQuery({ sort: sort ?? null });
  }

  setView(view: 'grid' | 'list') {
    this.patchQuery({ view }, false);
  }

  toggleType(id: number | string) {
    this.patchQuery({ typeId: this.typeId() === Number(id) ? null : id });
  }

  toggleBrand(id: number | string) {
    this.patchQuery({ brandId: this.brandId() === Number(id) ? null : id });
  }

  clearFilters() {
    this.patchQuery({ typeId: null, brandId: null });
  }

  goToPage(page: number) {
    this.patchQuery({ pageIndex: page }, false);
  }
}

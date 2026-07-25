import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { Basket, BasketItem, Product } from '@core/models/models';

const BASKET_KEY = 'talabat_basket_id';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private readonly http = inject(HttpClient);

  readonly basket = signal<Basket | null>(null);
  readonly items = computed<BasketItem[]>(() => this.basket()?.items ?? []);
  readonly count = computed(() => this.items().reduce((s, i) => s + i.quantity, 0));
  readonly subtotal = computed(() => this.items().reduce((s, i) => s + i.price * i.quantity, 0));

  getBasketId(): string {
    if (typeof window === 'undefined') return 'guest-basket';
    let id = localStorage.getItem(BASKET_KEY);
    if (!id) {
      id = 'basket-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(BASKET_KEY, id);
    }
    return id;
  }

  clearBasketId() {
    if (typeof window !== 'undefined') localStorage.removeItem(BASKET_KEY);
  }

  /** Refreshes the in-memory basket signal from the API. */
  refresh() {
    const basketId = this.getBasketId();
    return this.http.get<Basket>(`${environment.apiBase}/api/Baskets`, { params: { basketId } }).pipe(
      catchError(() => of({ id: basketId, items: [] } as Basket)),
      tap((b) => this.basket.set(b)),
    );
  }

  private save(items: BasketItem[]) {
    const basketId = this.getBasketId();
    return this.http
      .post<Basket>(`${environment.apiBase}/api/Baskets`, { id: basketId, items })
      .pipe(tap((b) => this.basket.set(b)));
  }

  addProduct(product: Product, quantity = 1) {
    const items = [...this.items()];
    const found = items.find((i) => i.id === product.id);
    if (found) {
      found.quantity += quantity;
    } else {
      items.push({
        id: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        pictureUrl: product.pictureUrl,
        brand: product.productBrand,
        type: product.productType,
      });
    }
    return this.save(items);
  }

  updateQuantity(id: number, quantity: number) {
    const next = this.items()
      .map((i) => (i.id === id ? { ...i, quantity } : i))
      .filter((i) => i.quantity > 0);
    return this.save(next);
  }

  clear() {
    const basketId = this.getBasketId();
    return this.http
      .delete(`${environment.apiBase}/api/Baskets`, { params: { basketId } })
      .pipe(tap(() => this.basket.set({ id: basketId, items: [] })));
  }
}

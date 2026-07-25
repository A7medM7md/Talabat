import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { Pagination, Product } from '@core/models/models';

export interface ProductQuery {
  typeId?: number;
  brandId?: number;
  sort?: string;
  pageIndex: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBase}/api/Products`;

  getAll(query: ProductQuery) {
    let params = new HttpParams()
      .set('pageIndex', query.pageIndex)
      .set('pageSize', query.pageSize);
    if (query.typeId) params = params.set('typeId', query.typeId);
    if (query.brandId) params = params.set('brandId', query.brandId);
    if (query.sort) params = params.set('sort', query.sort);
    return this.http.get<Pagination<Product>>(this.base, { params });
  }

  getById(id: string | number) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }

  getTypes() {
    return this.http.get<unknown>(`${this.base}/Types`);
  }

  getBrands() {
    return this.http.get<unknown>(`${this.base}/Brands`);
  }

  /** Normalizes API responses that may return either string arrays or {id,name} objects. */
  static normalize(arr: unknown): { id: number | string; name: string }[] {
    if (!Array.isArray(arr)) return [];
    return arr.map((v, i) => (typeof v === 'string' ? { id: i + 1, name: v } : (v as { id: number; name: string })));
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Address, DeliveryMethod, Order, PaymentIntentResponse } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);

  getDeliveryMethods() {
    return this.http.get<DeliveryMethod[]>(`${environment.apiBase}/api/Orders/DeliveryMethods`);
  }

  getMyOrders() {
    return this.http.get<Order[]>(`${environment.apiBase}/api/Orders`);
  }

  getOrder(id: string | number) {
    return this.http.get<Order>(`${environment.apiBase}/api/Orders/${id}`);
  }

  createOrder(payload: { basketId: string; deliveryMethodId: number; shipToAddress: Address }) {
    return this.http.post<{ id: number }>(`${environment.apiBase}/api/Orders`, payload);
  }

  createPaymentIntent(basketId: string) {
    return this.http.post<PaymentIntentResponse>(`${environment.apiBase}/api/Payments/${basketId}`, {});
  }
}

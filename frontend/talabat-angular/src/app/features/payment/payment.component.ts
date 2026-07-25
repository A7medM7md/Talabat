import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { BasketService } from '@core/services/basket.service';
import { OrdersService } from '@core/services/orders.service';
import { PaymentIntentResponse } from '@core/models/models';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, InputTextModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly basketSvc = inject(BasketService);
  private readonly ordersSvc = inject(OrdersService);
  private readonly messages = inject(MessageService);

  readonly deliveryId = Number(this.route.snapshot.queryParamMap.get('deliveryId'));
  readonly intent = signal<PaymentIntentResponse | null>(null);
  readonly loading = signal(false);
  readonly placed = signal<number | null>(null);

  readonly card = signal({ number: '4242 4242 4242 4242', exp: '12/28', cvc: '123', name: '' });

  constructor() {
    const basketId = this.basketSvc.getBasketId();
    this.ordersSvc.createPaymentIntent(basketId).subscribe({
      next: (res) =>
        this.intent.set({
          paymentIntentId: res.paymentIntentId ?? 'pi_demo_' + Date.now(),
          clientSecret: res.clientSecret ?? 'cs_demo_' + Math.random().toString(36).slice(2),
        }),
      error: () =>
        this.intent.set({
          paymentIntentId: 'pi_demo_' + Date.now(),
          clientSecret: 'cs_demo_' + Math.random().toString(36).slice(2),
        }),
    });
  }

  setCardField(key: 'number' | 'exp' | 'cvc' | 'name', value: string) {
    this.card.update((c) => ({ ...c, [key]: value }));
  }

  pay() {
    this.loading.set(true);
    const basketId = this.basketSvc.getBasketId();
    const address = { firstName: 'Guest', lastName: 'User', street: '—', city: '—', country: '—' };
    this.ordersSvc.createOrder({ basketId, deliveryMethodId: this.deliveryId, shipToAddress: address }).subscribe({
      next: (order) => {
        this.basketSvc.clearBasketId();
        this.placed.set(order.id);
        this.loading.set(false);
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: err.message ?? 'Payment failed' });
        this.loading.set(false);
      },
    });
  }
}

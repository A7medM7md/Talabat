import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@core/services/auth.service';
import { AccountService } from '@core/services/account.service';
import { BasketService } from '@core/services/basket.service';
import { OrdersService } from '@core/services/orders.service';
import { Address, DeliveryMethod } from '@core/models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, InputTextModule, CheckboxModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly accountSvc = inject(AccountService);
  readonly basketSvc = inject(BasketService);
  private readonly ordersSvc = inject(OrdersService);
  private readonly messages = inject(MessageService);

  readonly authed = computed(() => this.auth.isAuthenticated());
  readonly addr = signal<Address>({ firstName: '', lastName: '', street: '', city: '', country: '' });
  readonly saveAddress = signal(true);
  readonly deliveryId = signal<number | null>(
    this.route.snapshot.queryParamMap.get('deliveryId')
      ? Number(this.route.snapshot.queryParamMap.get('deliveryId'))
      : null,
  );
  readonly methods = signal<DeliveryMethod[]>([]);

  readonly delivery = computed(() => this.methods().find((m) => m.id === this.deliveryId()));
  readonly total = computed(() => this.basketSvc.subtotal() + (this.delivery()?.cost ?? 0));

  constructor() {
    this.basketSvc.refresh().subscribe();
    this.ordersSvc.getDeliveryMethods().subscribe({
      next: (m) => this.methods.set(m),
      error: () => this.methods.set([]),
    });
    if (this.authed()) {
      this.accountSvc.getAddress().subscribe({
        next: (a) => this.addr.set(a),
        error: () => void 0,
      });
    }
  }

  setField<K extends keyof Address>(key: K, value: Address[K]) {
    this.addr.update((a) => ({ ...a, [key]: value }));
  }

  submit() {
    if (!this.authed) {
      this.messages.add({ severity: 'error', summary: 'Please log in to continue' });
      this.router.navigate(['/login']);
      return;
    }
    if (!this.deliveryId()) {
      this.messages.add({ severity: 'error', summary: 'Choose a delivery method' });
      return;
    }
    const proceed = () => this.router.navigate(['/payment'], { queryParams: { deliveryId: this.deliveryId() } });
    if (this.saveAddress()) {
      this.accountSvc.saveAddress(this.addr()).subscribe({
        next: proceed,
        error: (err) => this.messages.add({ severity: 'error', summary: err.message ?? 'Could not save address' }),
      });
    } else {
      proceed();
    }
  }
}

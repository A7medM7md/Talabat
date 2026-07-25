import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { OrdersService } from '@core/services/orders.service';
import { Order } from '@core/models/models';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders-list.component.html',
})
export class OrdersListComponent {
  private readonly auth = inject(AuthService);
  private readonly ordersSvc = inject(OrdersService);

  readonly authed = this.auth.isAuthenticated();
  readonly orders = signal<Order[] | null>(null);
  readonly loading = signal(true);

  constructor() {
    if (this.authed) {
      this.ordersSvc.getMyOrders().subscribe({
        next: (o) => {
          this.orders.set(o);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      this.loading.set(false);
    }
  }
}

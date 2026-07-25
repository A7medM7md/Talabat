import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { BasketService } from '@core/services/basket.service';
import { OrdersService } from '@core/services/orders.service';
import { DeliveryMethod } from '@core/models/models';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';
import { resolveImageUrl } from '@core/services/image.util';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, RadioButtonModule, ButtonModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basket.component.html',
})
export class BasketComponent {
  readonly basketSvc = inject(BasketService);
  private readonly ordersSvc = inject(OrdersService);

  readonly loading = signal(true);
  readonly methods = signal<DeliveryMethod[]>([]);
  readonly deliveryId = signal<number | null>(null);

  readonly items = computed(() => this.basketSvc.items());
  readonly subtotal = computed(() => this.basketSvc.subtotal());
  readonly delivery = computed(() => this.methods().find((m) => m.id === this.deliveryId()));
  readonly total = computed(() => this.subtotal() + (this.delivery()?.cost ?? 0));

  constructor() {
    this.basketSvc.refresh().subscribe(() => this.loading.set(false));
    this.ordersSvc.getDeliveryMethods().subscribe({
      next: (m) => this.methods.set(m),
      error: () => this.methods.set([]),
    });
  }

  resolveImg(url: string): string {
    return resolveImageUrl(url);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  updateQty(id: number, qty: number) {
    this.basketSvc.updateQuantity(id, qty).subscribe();
  }

  clear() {
    this.basketSvc.clear().subscribe();
  }
}

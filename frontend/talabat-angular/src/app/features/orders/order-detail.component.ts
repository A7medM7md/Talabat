import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService } from '@core/services/orders.service';
import { Order } from '@core/models/models';
import { resolveImageUrl } from '@core/services/image.util';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from "lucide-angular";

interface TimelineStep {
  icon: string;
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-detail.component.html',
})
export class OrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersSvc = inject(OrdersService);

  readonly id = this.route.snapshot.paramMap.get('id')!;
  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly timeline: TimelineStep[] = [
    { icon: 'check-circle-2', label: 'Order placed', done: true },
    { icon: 'chef-hat', label: 'Preparing your food', done: true },
    { icon: 'truck', label: 'Out for delivery', done: false },
    { icon: 'package', label: 'Delivered', done: false },
  ];

  constructor() {
    this.ordersSvc.getOrder(this.id).subscribe({
      next: (o) => {
        this.order.set(o);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  resolveImg(url: string): string {
    return resolveImageUrl(url);
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}

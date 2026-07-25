import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { BasketService } from '@core/services/basket.service';

@Component({
  selector: 'app-mobile-cart-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (basketSvc.count() > 0 && !isHiddenRoute()) {
      <a
        routerLink="/basket"
        class="md:hidden fixed bottom-4 left-4 right-4 z-30 flex items-center justify-between rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-brand animate-fade-up"
      >
        <div class="flex items-center gap-2 font-semibold">
          <lucide-icon name="shopping-bag" [size]="20" />
          <span>{{ basketSvc.count() }} {{ basketSvc.count() === 1 ? 'item' : 'items' }}</span>
        </div>
        <div class="font-bold">View cart • {{ basketSvc.subtotal().toFixed(2) }} AED</div>
      </a>
    }
  `,
})
export class MobileCartBarComponent {
  readonly basketSvc = inject(BasketService);
  private readonly router = inject(Router);

  private readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  isHiddenRoute() {
    const path = this.currentPath();
    return path.startsWith('/basket') || path.startsWith('/checkout') || path.startsWith('/payment');
  }
}

import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@core/services/auth.service';
import { BasketService } from '@core/services/basket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly basketSvc = inject(BasketService);
  private readonly router = inject(Router);

  readonly mobileOpen = signal(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.fetchCurrentUser().subscribe({
        next: (u) => this.auth.currentUser.set(u),
        error: () => void 0,
      });
    }
    this.basketSvc.refresh().subscribe();
    // Keep the cart badge fresh, same spirit as the original 3s refetchInterval.
    setInterval(() => this.basketSvc.refresh().subscribe(), 3000);
  }

  toggleMobile() {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeMobile();
    this.router.navigate(['/']);
  }
}

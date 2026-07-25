import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';
import { AccountService } from '@core/services/account.service';
import { Address, CurrentUser } from '@core/models/models';
import { EmptyStateComponent } from '@shared/empty-state/empty-state.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, InputTextModule, ButtonModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly accountSvc = inject(AccountService);
  private readonly messages = inject(MessageService);

  readonly authed = this.auth.isAuthenticated();
  readonly user = signal<CurrentUser | null>(null);
  readonly addr = signal<Address>({ firstName: '', lastName: '', street: '', city: '', country: '' });
  readonly saving = signal(false);

  constructor() {
    if (this.authed) {
      this.auth.fetchCurrentUser().subscribe({
        next: (u) => {
          this.user.set(u);
          this.auth.currentUser.set(u);
        },
        error: () => void 0,
      });
      this.accountSvc.getAddress().subscribe({
        next: (a) => this.addr.set(a),
        error: () => void 0,
      });
    }
  }

  setField<K extends keyof Address>(key: K, value: Address[K]) {
    this.addr.update((a) => ({ ...a, [key]: value }));
  }

  save() {
    this.saving.set(true);
    this.accountSvc.saveAddress(this.addr()).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Address updated' });
        this.saving.set(false);
      },
      error: (err) => {
        this.messages.add({ severity: 'error', summary: err.error?.message ?? err.message ?? 'Could not save address' });
        this.saving.set(false);
      },
    });
  }
}

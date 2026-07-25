import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';

type EmailState = 'idle' | 'checking' | 'available' | 'taken';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, InputTextModule, PasswordModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  // private readonly destroyRef = inject(DestroyRef);

  readonly displayName = signal('');
  readonly email = signal('');
  readonly phoneNumber = signal('');
  readonly password = signal('');
  readonly emailState = signal<EmailState>('idle');
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  // private readonly emailChanges = new Subject<string>();

  constructor() {
    // this.emailChanges
    //   .pipe(
    //     debounceTime(500),
    //     distinctUntilChanged(),
    //     switchMap((email) => {
    //       if (!email || !email.includes('@')) {
    //         this.emailState.set('idle');
    //         return of(null);
    //       }
    //       this.emailState.set('checking');
    //       return this.auth.emailExists(email).pipe(catchError(() => of(null)));
    //     }),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe((taken) => {
    //     if (taken === null) return;
    //     this.emailState.set(taken ? 'taken' : 'available');
    //   });
  }

  onEmailChange(value: string) {
    this.email.set(value);
    // this.emailChanges.next(value);
  }

  submit() {
    this.error.set(null);
    this.loading.set(true);
    this.auth
      .register({
        displayName: this.displayName(),
        email: this.email(),
        phoneNumber: this.phoneNumber(),
        password: this.password(),
      })
      .subscribe({
        next: (user) => {
          this.auth.applySession(user);
          this.messages.add({ severity: 'success', summary: `Welcome ${user.displayName}!` });
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set(err.error?.message ?? err.message ?? 'Registration failed');
          this.loading.set(false);
        },
      });
  }
}

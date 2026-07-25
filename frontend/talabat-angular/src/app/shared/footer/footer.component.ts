import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-20 border-t border-border bg-surface">
      <div class="container-page py-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <div class="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-black">t</div>
            <span class="font-black text-lg">talabat</span>
          </div>
          <p class="text-muted-foreground">Order food, groceries and more from your favourite places.</p>
        </div>
        <div>
          <div class="font-semibold mb-3">Company</div>
          <ul class="space-y-2 text-muted-foreground">
            <li>About us</li>
            <li>Careers</li>
            <li>Newsroom</li>
          </ul>
        </div>
        <div>
          <div class="font-semibold mb-3">For you</div>
          <ul class="space-y-2 text-muted-foreground">
            <li>Help centre</li>
            <li>Partner with us</li>
            <li>Ride with us</li>
          </ul>
        </div>
        <div>
          <div class="font-semibold mb-3">Get the app</div>
          <div class="flex flex-col gap-2">
            <div class="rounded-lg border border-border px-3 py-2 bg-background">App Store</div>
            <div class="rounded-lg border border-border px-3 py-2 bg-background">Google Play</div>
          </div>
        </div>
      </div>
      <div class="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {{ year }} Talabat Clone — Portfolio project.
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}

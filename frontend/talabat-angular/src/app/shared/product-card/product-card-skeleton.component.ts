import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-card-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-2xl overflow-hidden border border-border bg-card">
      <div class="skeleton aspect-[4/3] rounded-none"></div>
      <div class="p-4 space-y-2">
        <div class="skeleton h-3 w-1/3"></div>
        <div class="skeleton h-4 w-3/4"></div>
        <div class="skeleton h-3 w-full"></div>
        <div class="flex justify-between pt-2">
          <div class="skeleton h-6 w-16"></div>
          <div class="skeleton h-9 w-9 rounded-full"></div>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardSkeletonComponent {}

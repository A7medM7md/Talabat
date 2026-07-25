import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-4">
      <div class="grid h-20 w-20 place-items-center rounded-full bg-accent text-primary mb-4">
        <ng-content select="[icon]" />
      </div>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      @if (description) {
        <p class="text-sm text-muted-foreground mt-1 max-w-sm">{{ description }}</p>
      }
      <div class="mt-6">
        <ng-content select="[action]" />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
}

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';
import { MessageService } from 'primeng/api';
import { LucideAngularModule, MapPin, Search, Clock, Truck, Shield, ShoppingBag, User, Package, LogOut, Menu, X, Grid3x3, List, SlidersHorizontal, Plus, Minus, Star, ChevronRight, Trash2, Mail, Lock, Eye, EyeOff, Check, Loader2, CheckCircle2, ChefHat, CreditCard } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from '@core/interceptors/auth.interceptor';

// Re-skin PrimeNG's Aura preset so every component (buttons, selects, radios,
// toasts...) shares the same brand-orange accent as the hand-written Tailwind
// utilities in styles.scss, instead of PrimeNG's default blue.
const BrandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff3ec',
      100: '#ffe2d1',
      200: '#ffc4a3',
      300: '#ff9d6e',
      400: '#ff7a42',
      500: '#ff5a00',
      600: '#e65200',
      700: '#c74600',
      800: '#a13900',
      900: '#7d2d00',
      950: '#431800',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: BrandPreset,
        options: { darkModeSelector: '.dark' },
      },
    }),
    MessageService,
    importProvidersFrom(
      LucideAngularModule.pick({
        MapPin,
        Search,
        Clock,
        Truck,
        Shield,
        ShoppingBag,
        User,
        Package,
        LogOut,
        Menu,
        X,
        Grid3x3,
        List,
        SlidersHorizontal,
        Plus,
        Minus,
        Star,
        ChevronRight,
        Trash2,
        Mail,
        Lock,
        Eye,
        EyeOff,
        Check,
        Loader2,
        CheckCircle2,
        ChefHat,
        CreditCard,
      }),
    ),
  ],
};

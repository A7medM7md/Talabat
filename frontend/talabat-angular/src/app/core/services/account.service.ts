import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Address } from '@core/models/models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  getAddress() {
    return this.http.get<Address>(`${environment.apiBase}/api/Accounts/Address`);
  }

  saveAddress(address: Address) {
    return this.http.put<Address>(`${environment.apiBase}/api/Accounts/Address`, address);
  }
}

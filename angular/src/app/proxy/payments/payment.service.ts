import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiName = 'Default';

  getVietQrUrl = (orderId: string) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: `/api/app/payment/viet-qr-url/${orderId}`,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}

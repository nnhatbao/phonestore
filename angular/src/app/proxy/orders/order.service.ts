import type { CreateOrderDto } from './models';
import { RestService } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiName = 'Default';

  create = (input: CreateOrderDto) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/order',
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}

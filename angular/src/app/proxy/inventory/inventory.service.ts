import type { InventoryReportDto } from './dtos/models';
import type { ImportStockInputDto, InventoryHistoryDto, InventoryItemDto, UpdateStockDto } from './models';
import { RestService } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateInventoryDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  apiName = 'Default';

  create = (input: CreateInventoryDto) =>
    this.restService.request<any, InventoryItemDto>({
      method: 'POST',
      url: '/api/app/inventory',
      body: input,
    },
    { apiName: this.apiName });

  getHistory = (variantId: string) =>
    this.restService.request<any, InventoryHistoryDto[]>({
      method: 'GET',
      url: `/api/app/inventory/history/${variantId}`,
    },
    { apiName: this.apiName });

  getList = (input: PagedAndSortedResultRequestDto) =>
    this.restService.request<any, PagedResultDto<InventoryItemDto>>({
      method: 'GET',
      url: '/api/app/inventory',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, sorting: input.sorting },
    },
    { apiName: this.apiName });

  getReport = (fromDate: string, toDate: string) =>
    this.restService.request<any, InventoryReportDto[]>({
      method: 'GET',
      url: '/api/app/inventory/report',
      params: { fromDate, toDate },
    },
    { apiName: this.apiName });

  importStock = (variantId: string, input: ImportStockInputDto) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/inventory/import-stock/${variantId}`,
      body: input,
    },
    { apiName: this.apiName });

  updateStock = (id: string, input: UpdateStockDto) =>
    this.restService.request<any, InventoryItemDto>({
      method: 'PUT',
      url: `/api/app/inventory/${id}/stock`,
      body: input,
    },
    { apiName: this.apiName });

  constructor(private restService: RestService) {}
}

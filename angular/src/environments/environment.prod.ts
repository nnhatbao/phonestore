import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'PhoneStore',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44337',
    redirectUri: baseUrl,
    clientId: 'PhoneStore_App',
    responseType: 'code',
    scope: 'offline_access PhoneStore',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44337',
      rootNamespace: 'PhoneStore',
    },
  },
} as Environment;

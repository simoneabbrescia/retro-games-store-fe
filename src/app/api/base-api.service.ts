import { HttpClient, HttpParams } from '@angular/common/http';

export abstract class BaseApi {
  protected readonly baseUrl = 'http://localhost:9090/api/v1/retro-games';

  protected constructor(protected http: HttpClient) {}
}

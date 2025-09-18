import { HttpClient, HttpParams } from '@angular/common/http';

export abstract class BaseApi {
  protected readonly baseUrl = 'http://localhost:9090/api/v1/retro-games';

  protected constructor(protected http: HttpClient) {}

  protected toParams(obj: Record<string, any> = {}) {
    const clean = Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== undefined && v !== null && v !== ''
      )
    );
    return new HttpParams({ fromObject: clean });
  }
}

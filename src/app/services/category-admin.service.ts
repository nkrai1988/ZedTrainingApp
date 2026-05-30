import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class CategoryAdminService {

  constructor(private api: ApiService) {}

  getAdmins(): Observable<any[]> {
    return this.api.getSimple(APPURLs.categoryadminlist);
  }

  createAdmin(body: any): Observable<any> {
    return this.api.postSimpleWithHeader(APPURLs.categoryadminadd, body);
  }

  toggleStatus(id: number): Observable<any> {
    return this.api.putSimple(`${APPURLs.categoryadminstatus}/${id}/status`, {});
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class OrgCategoryService {

  constructor(private api: ApiService) {}

  getCategories(): Observable<any[]> {
    return this.api.getSimple(APPURLs.orgcategorylist);
  }

  saveCategory(body: any): Observable<any> {
    return this.api.postSimpleWithHeader(APPURLs.orgcategoryadd, body);
  }

  toggleStatus(id: number): Observable<any> {
    return this.api.putSimple(`${APPURLs.orgcategorystatus}/${id}/status`, {});
  }

  addSubCategory(categoryId: number, body: any): Observable<any> {
    return this.api.postSimpleWithHeader(`${APPURLs.orgsubcategoryadd}/${categoryId}/subcategories`, body);
  }
}

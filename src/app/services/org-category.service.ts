import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrgCategoryService {

  constructor(private api: ApiService, private http: HttpClient) {}

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

  getSubCategory(subCategoryId: number): Observable<any> {
    return this.api.getSimple(`${APPURLs.orgcategorylist}/subcategories/${subCategoryId}`);
  }

  updateSubCategory(subCategoryId: number, body: any): Observable<any> {
    return this.api.putSimple(`${APPURLs.orgcategorylist}/subcategories/${subCategoryId}`, body);
  }

  uploadLogo(categoryId: number, logo: File): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const formData = new FormData();
    formData.append('logo', logo, logo.name);
    return this.http.post(`${environment.apiurl}/orgcategory/${categoryId}/logo`, formData, { headers });
  }

  uploadSubCategoryTemplate(subCategoryId: number, file: File): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const formData = new FormData();
    formData.append('template', file, file.name);
    return this.http.post(`${environment.apiurl}/orgcategory/subcategories/${subCategoryId}/template`, formData, { headers });
  }
}

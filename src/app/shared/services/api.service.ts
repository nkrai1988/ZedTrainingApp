import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiurl; //'https://localhost:7161/api';

  constructor(private http: HttpClient) {}
  
  getHeaders():HttpHeaders{
  let token= localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'
  });
  return headers;  
  }

  getHeadersForFile():HttpHeaders{
  let token= localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+token,
    'responseType': 'blob'
  });
  return headers;  
  }

  // getSimple(url: string, params?: HttpHeaders): Observable<any> {
    
  //   return this.http.get<any>(`${this.baseUrl}/${url}`);
  // }
  getSimple(url: string, params?: HttpHeaders): Observable<any> {
    let headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/${url}`, { headers });
  }

  getTestFile(url: string):Observable<HttpResponse<Blob>>{
    let token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.get(`${this.baseUrl}/${url}`, { observe: 'response', responseType: 'blob', headers });
  }

  getExceltFileWithFilterPost(url: string,filter:any):Observable<HttpResponse<Blob>>{
    let token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post(`${this.baseUrl}/${url}`,filter ,{ observe: 'response', responseType: 'blob', headers });
   // return this.http.get(`${this.baseUrl}/${url}`, { observe: 'response', responseType: 'blob', headers });
  }

  postTestFile(url: string,data:any):Observable<HttpResponse<Blob>>{
    
   return this.http.post(url,data, {observe: 'response', responseType: 'blob' });
  
  }

  getSimpleFile(url: string, params?: HttpHeaders): Observable<any> {
    let headers = this.getHeadersForFile();
    return this.http.get<any>(`${this.baseUrl}/${url}`, { headers });
  }

  postSimple(url: string, body: any, headers?: HttpHeaders | {[header: string]: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/${url}`, body, { headers });
  }

  postSimpleWithHeader(url: string, body: any | {[header: string]: string}): Observable<any> {
    let headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/${url}`, body, { headers });
  }

  putSimple(url: string, body: any | {[header: string]: string}): Observable<any> {
    let headers = this.getHeaders();
    return this.http.put<any>(`${this.baseUrl}/${url}`, body, { headers });
  }

  get<T>(url: string, params?: HttpParams | {[param: string]: string | number | boolean}): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders | {[header: string]: string}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, { headers });
  }

  postWithFile(url: string, body: Record<string, any>, file: File | null | undefined, fileFieldName: string = 'file'): Observable<any> {
    const formData = new FormData();
    console.log('called');
    if (file) {
      formData.append(fileFieldName, file, file.name);
    }
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value == null ? '' : String(value));
    });
    return this.http.post(`${this.baseUrl}/${url}`, formData);
  }

  put<T>(url: string, body: any, headers?: HttpHeaders | {[header: string]: string}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, { headers });
  }

  delete<T>(url: string, params?: HttpParams | {[param: string]: string | number | boolean}): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { params });
  }
}


import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APPURLs } from "../shared/constants/url.constants";
import { ApiService } from "../shared/services/api.service";

@Injectable({
    providedIn:'root'
})
export class AuthService{
constructor(private http: HttpClient, private api: ApiService){}


postLoginData(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.postSimple(APPURLs.login,body)
}



postUserCheck(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.postSimple(APPURLs.usercheck,body)
}



postChangePassword(data:any){
    return this.api.postSimpleWithHeader(APPURLs.changePassword,data);
}

postRegisterData(body:any) {
   // return this.http.post(APPURLs.base+APPURLs.login, body);
   return this.api.postSimple(APPURLs.register,body)
}

postParticipantRegister(body:any) {
   return this.api.postSimple(APPURLs.participantRegister, body);
}

getRegisterDetailData(id:string){
   var query = "?id="+id;
   return this.api.getSimple(APPURLs.registrationdetail+query);
}
  

}

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
   return this.api.postSimpleWithHeader(APPURLs.register, body);
}

postParticipantRegister(body:any) {
   return this.api.postSimple(APPURLs.participantRegister, body);
}

postParticipantVerifyOtp(body:any) {
   return this.api.postSimple(APPURLs.participantVerifyOtp, body);
}

postParticipantSignIn(body:any) {
   return this.api.postSimple(APPURLs.participantSignin, body);
}

postParticipantForgotPassword(body:any) {
   return this.api.postSimple(APPURLs.participantForgotPassword, body);
}

postParticipantVerifyResetOtp(body:any) {
   return this.api.postSimple(APPURLs.participantVerifyResetOtp, body);
}

verifyParticipantEmail(token: string) {
   return this.api.getSimple(APPURLs.participantVerifyEmail + '?token=' + token);
}

getParticipantCategories() {
   return this.api.getSimple(APPURLs.participantCategories);
}

getRegisterDetailData(id:string){
   var query = "?id="+id;
   return this.api.getSimple(APPURLs.registrationdetail+query);
}
  

}
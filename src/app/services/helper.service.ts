import { JSONParser } from "@amcharts/amcharts5";
import { Inject, Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AppProgrammeTypes } from "../shared/constants/programmetype.constant";
import { HttpClient } from "@angular/common/http";
import { ApiService } from "../shared/services/api.service";
import { APPURLs } from "../shared/constants/url.constants";
import { BehaviorSubject } from "rxjs";
@Injectable({
    providedIn:'root'
})
export class HelperService{
    constructor(private router:Router,private http:HttpClient,private api: ApiService){

    }
    //private router= Inject(Router);
    mainPortal='training';
    private dataSubject = new BehaviorSubject<string>('training');
    data$ = this.dataSubject.asObservable(); // Observable to subscribe to

    setPortal(portal:string){
        this.mainPortal=portal;
        this.dataSubject.next(portal);
    }
    getAllStates(){        
           return this.api.getSimple(APPURLs.statesall);  
    }

    getDistrictByStates(stateId:string){
        let query ="?stateId="+stateId;
        return this.api.getSimple(APPURLs.districtbystates+query);  
    }

    storeLoginData(data:any){
        console.log('Success:', data)
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    isLoggedIn():boolean{
        let token = this.getToken();
        if(token){
            return true;
        }
        else{
            return false;
        }
    }

    userLogOut(){
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.router.navigate(['/signin']);
    }

    getToken(){
        return localStorage.getItem('authToken');        
    }

    getUser(){
        let userString:any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user;
    }
    getUserRole(){
        let userString:any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user ? user.role : '';
    }

    getUserEmail(){
        let userString:any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user ? user.email : '';
    }

    getLoggedUserProgramme(){
        let userString:any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        
        return user.tptype;
    }

    IsSuperAdmin():boolean{
        var role = this.getUserRole();
        if(role &&  role == '1'){
            return true;
        }
        return false;
    }

    IsAgency():boolean{
        var role = this.getUserRole();
        if(role &&  role == '3'){
            return true;
        }
        return false;
    }

    IsAssessor():boolean{
        var role = this.getUserRole();
        if(role &&  role == '5'){
            return true;
        }
        return false;
    }

    IsAdmin():boolean{
        var user = this.getUser();
        if(user && user.userId && user.userId == '1'){
            return true;
        }
        return false;
    }
    IsMasterAdmin():boolean{
        var user = this.getUser();
        if(user && user.userId && user.userId == '1'){
            return true;
        }
        return false;
    }

    superMasterAdminTrainingProgrammeOptions(){
        let tp:any=[];
        tp.push({label:AppProgrammeTypes.iap,value:AppProgrammeTypes.iapValue});
        tp.push({label:AppProgrammeTypes.tp,value:AppProgrammeTypes.tpValue});
        return tp; 
    }

    superAdminTrainingProgrammeOptions(){
        let tp:any=[];
        tp.push(AppProgrammeTypes.iap);
        tp.push(AppProgrammeTypes.tp);
        return tp; 
    }

    userTrainingProgrammeDefaultValue(){
            if(this.IsSuperAdmin()){
                return AppProgrammeTypes.iapValue;
            }
            else{
              return  AppProgrammeTypes.tpValue
            }
    }

    getUserTraingProgrammes():any{
        let tp:any=[];
        if(this.IsSuperAdmin()){
            tp.push(AppProgrammeTypes.iap);
            tp.push(AppProgrammeTypes.tp);
        }
        else{
        if(this.getLoggedUserProgramme() == AppProgrammeTypes.tp){
            tp.push(AppProgrammeTypes.tp);
        }

        if(this.getLoggedUserProgramme() == AppProgrammeTypes.iap){
            tp.push(AppProgrammeTypes.iap);
        }
    }
    return tp;
}

    getUserTraingProgrammeswithValue():any{
        let tp:any=[];
        if(this.IsSuperAdmin()){
            tp.push({qpName:AppProgrammeTypes.iap,qpCode:AppProgrammeTypes.iapValue});
            tp.push({qpName:AppProgrammeTypes.tp,qpCode:AppProgrammeTypes.tpValue});            
        }
        else{
        if(this.getLoggedUserProgramme() == AppProgrammeTypes.tp){
            tp.push({qpName:AppProgrammeTypes.tp,qpCode:AppProgrammeTypes.tpValue}); 
        }

        if(this.getLoggedUserProgramme() == AppProgrammeTypes.iap){
            tp.push({qpName:AppProgrammeTypes.iap,qpCode:AppProgrammeTypes.iapValue});
        }
    }
    return tp;
}

getProgrammeStatus(){
    return [
    { value: '0', label: 'Permission Pending' },
    { value: '1', label: 'Permission Accepted' },
    { value: '11', label: 'Calendar Created' },//{ value: '12', label: 'Calendar Created' }, 
    { value: '2', label: 'QC Pending' },//{ value: '6', label: 'QC Pending' },
    { value: '3', label: 'QC Approved' },
    { value: '4', label: 'Permission Rejected' },
    { value: '5', label: 'QC Rejected' },       
    { value: '7', label: 'Postponed' },  
    
    ];

}

getIDProofDocumentType(){
        let tp:any=[];
        tp.push('Bank');
        tp.push('PAN');
        tp.push('Passport');
        tp.push('Driving License');
        tp.push('Election Card');
        tp.push('Ration Card');
        return tp; 
    }

getLanguage(){
    return ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Kashmiri", "Konkani", "Malayalam", "Manipuri", "Marathi", "Nepali", "Oriya", "Punjabi", "Sanskrit", "Sindhi", "Tamil", "Telugu", "Urdu", "Bodo", "Santhali", "Maithili", "Dogri"];
}

getDayMonthYearRange(){
    var data:any={};
    data.Days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];
    data.Months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    data.Years = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"];

    return data;
}

createOptions(arr:any):any{
      var temp:any=[];
      arr.forEach((el:any) => {
          temp.push({label:el,value:el});
      });
      return temp;
    }

    convertFileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
     });     
}

  downloadFile(base64file:string,fileName:string) {
  const link = document.createElement('a');
  link.href = base64file; // The base64 string includes the data: mime type
  link.download = fileName;
  link.click();
}

}
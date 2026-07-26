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
        if (!this.IsSuperAdmin()) {
            const user = this.getUser();
            if (user?.orgCategoryId) {
                this.masterOrgCategoryId = user.orgCategoryId;
                this.categorySubject.next(user.orgCategoryId);
            }
            if (user?.orgCategoryName) {
                this.masterOrgCategoryName = user.orgCategoryName;
                this.categoryNameSubject.next(user.orgCategoryName);
            }
            if (user?.userSubCategoryId) {
                this.subCategorySubject.next(user.userSubCategoryId);
            }
        }
    }

    private categorySubject = new BehaviorSubject<number | null>(null);
    category$ = this.categorySubject.asObservable();

    private categoryNameSubject = new BehaviorSubject<string | null>(null);
    categoryName$ = this.categoryNameSubject.asObservable();

    private subCategorySubject = new BehaviorSubject<number | null>(null);
    subCategory$ = this.subCategorySubject.asObservable();

    mainPortal='training';
    private dataSubject = new BehaviorSubject<string>('training');
    data$ = this.dataSubject.asObservable();

    masterOrgCategoryId: number | null = null;
    masterOrgCategoryName: string | null = null;

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
        this.masterOrgCategoryId = data.user.orgCategoryId ?? null;
        if (!this.IsSuperAdmin()) {
            this.categorySubject.next(data.user.orgCategoryId ?? null);
            this.categoryNameSubject.next(data.user.orgCategoryName ?? null);
            this.subCategorySubject.next(data.user.userSubCategoryId ?? null);
        } else {
            this.categorySubject.next(null);
            this.categoryNameSubject.next(null);
            this.subCategorySubject.next(null);
        }
    }

    getOrgSubCategoryId(): number | null {
        let userString: any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user?.userSubCategoryId ?? null;
    }

    getOrgSubCategoryValue(): string | null {
        let userString: any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user?.orgSubCategoryValue ?? null;
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
        const role = this.getUserRole();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        if (role == '7') {
            this.router.navigate(['/participant/signin']);
        } else {
            this.router.navigate(['/signin']);
        }
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

    getUserId(): string {
        let userString: any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user ? user.userId : '';
    }

    getLoggedUserProgramme(){
        let userString:any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        
        return user.tptype;
    }

    getOrgCategoryId(): number | null {
        if (this.IsSuperAdmin()) {
            return this.masterOrgCategoryId;
        }
        let userString: any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user?.orgCategoryId ?? null;
    }

    setOrgCategoryId(categoryId: number | null) {
        this.masterOrgCategoryId = categoryId;
        this.categorySubject.next(categoryId);
    }

    getOrgCategoryName(): string | null {
        if (this.IsSuperAdmin()) {
            return this.masterOrgCategoryName;
        }
        let userString: any = localStorage.getItem('user');
        let user = JSON.parse(userString);
        return user?.orgCategoryName ?? null;
    }

    setOrgCategoryName(name: string | null) {
        this.masterOrgCategoryName = name;
        this.categoryNameSubject.next(name);
    }

    setOrgSubCategoryId(subCategoryId: number | null) {
        this.subCategorySubject.next(subCategoryId);
    }

    getCategoryAdminSubCategories(): { id: number; label: string }[] {
        const user = this.getUser();
        return user?.subCategories ?? [];
    }

    IsCategoryAdmin(): boolean {
        const user = this.getUser();
        return user && user.role == 1;
    }

    IsSuperAdmin(): boolean {
        var role = this.getUserRole();
        return role == '100';
    }

    IsAgency():boolean{
        var role = this.getUserRole();
        if(role &&  role == '3'){
            return true;
        }
        return false;
    }

    IsCoordinator():boolean{
        var role = this.getUserRole();
        if(role &&  role == '4'){
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

    IsParticipant():boolean{
        var role = this.getUserRole();
        if(role &&  role == '7'){
            return true;
        }
        return false;
    }

    // IsAdmin():boolean{
    //     var user = this.getUser();
    //     if(user && user.userId && user.userId == '1'){
    //         return true;
    //     }
    //     return false;
    // }

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
            if(this.getLoggedUserProgramme() == AppProgrammeTypes.tp){
              return  AppProgrammeTypes.tpValue
            }
            else{
                return AppProgrammeTypes.iapValue;
            }
    }

    userProgrammeDefaultValue(){
            if(this.IsSuperAdmin()){
                return AppProgrammeTypes.iapValue;
            }
            else{
              return  AppProgrammeTypes.tpValue
            }
    }

    getUserTraingProgrammes():any{
        let tp:any=[];
        if(this.getLoggedUserProgramme() == AppProgrammeTypes.tp){
            tp.push(AppProgrammeTypes.tp);
        } else if(this.getLoggedUserProgramme() == AppProgrammeTypes.iap){
            tp.push(AppProgrammeTypes.iap);
        } else if(this.IsSuperAdmin()){
            tp.push(AppProgrammeTypes.iap);
            tp.push(AppProgrammeTypes.tp);
        }
    
    return tp;
}

    getUserTraingProgrammeswithValue():any{
        let tp:any=[];
        if(this.getLoggedUserProgramme() == AppProgrammeTypes.tp){
            tp.push({qpName:AppProgrammeTypes.tp,qpCode:AppProgrammeTypes.tpValue}); 
        } 
        else if(this.getLoggedUserProgramme() == AppProgrammeTypes.iap){
            tp.push({qpName:AppProgrammeTypes.iap,qpCode:AppProgrammeTypes.iapValue});
        }
        else if(this.IsSuperAdmin()){
            tp.push({qpName:AppProgrammeTypes.iap,qpCode:AppProgrammeTypes.iapValue});
            tp.push({qpName:AppProgrammeTypes.tp,qpCode:AppProgrammeTypes.tpValue});            
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
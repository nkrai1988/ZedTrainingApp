import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { RegisterComponent } from '../../../shared/components/auth/register/register.component';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { FileInputComponent } from '../../../shared/components/form/input/file-input.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { HelperService } from '../../../services/helper.service';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { QualificationComponent } from './qualification/qualification.component';
import { ExperienceComponent } from './experience/experience.component';
import { TechnicalskillsComponent } from './technicalskills/technicalskills.component';
import { ImageInputComponent } from '../../../shared/components/form/input/image-input.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-master-register',
  imports: [
    AuthPageLayoutComponent,
    RegisterComponent,
    QualificationComponent,
    ExperienceComponent,
    TechnicalskillsComponent,
    CommonModule,
    ComponentCardComponent,
    LabelComponent,
    FileInputComponent,
    ImageInputComponent,
    AlertComponent,
    RadioComponent,
    SelectComponent,
    FormsModule,
    ReactiveFormsModule,
    DatePickerComponent,
    CheckboxComponent
  ],
  templateUrl: './master-register.component.html',
  styleUrl: './master-register.component.css',
})
export class MasterRegisterComponent {
  constructor(private helper:HelperService,private fb: FormBuilder,private authservice:AuthService){

  }

  steponedata:any;
  email=null;
  contactno='';
  post='';
  checkedValue='';
  IDProofDocumentTypeOptions:any=[];
  IdProofSeelcted='';
  registerForm!: FormGroup;
  IdProofPhoto:any;
  StateOptions:any=[];
  SelectedState='';
  districtOptions:any=[];
  districtSelect='';
  imagePreview: string | null = null;
  languageOptions:any=[];
  speakinglangSelect='';
  writinglangSelect='';
  qualificationCollection=[];
  experienceCollection=[];
  skillsCollection=[];
  isaccepted=false;
  errormessage=''
  successmessage='';
  ngOnInit(){
    this.createForm();
    this.bindDropDowns();
     this.registerForm.get('nominatedthrough')?.valueChanges.subscribe(value => {
        

        const coordinatorname = this.registerForm.get('coordinatorname');
        const coordinatoremail = this.registerForm.get('coordinatoremail');
        const coordinatorphone = this.registerForm.get('coordinatorphone');

        if (value !== 'Freelancer') {
          coordinatorname?.setValidators([Validators.required]);
          coordinatoremail?.setValidators([Validators.required,Validators.email]);
          coordinatorphone?.setValidators([Validators.required,Validators.pattern(/^\d{10}$/)]);
        } else {          
          coordinatorname?.clearValidators();
          coordinatoremail?.clearValidators();
          coordinatorphone?.clearValidators();
        }

        coordinatorname?.updateValueAndValidity();
        coordinatoremail?.updateValueAndValidity();
        coordinatorphone?.updateValueAndValidity();
        
        });
  }

  createForm(){
    this.registerForm = this.fb.group({
      // email: ['', [Validators.required,,Validators.email]],
      // mobile: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],      
      role: ['', [Validators.required]],
      profileimage: ['', [Validators.required]],
      idproofdoctype: ['', [Validators.required]],
      docnumber: ['', [Validators.required]],
      nameondocument: ['', [Validators.required]],
      nominatedthrough: ['', [Validators.required]],
      accessorcbidcra: [''],
      consultantorg: [''],
      coordinatorname: [''],
      coordinatoremail: [''],
      coordinatorphone: [''],
      idproofphoto: ['', [Validators.required]],      
      FirstName: ['', [Validators.required]],
      MiddleName: [''],
      LastName: ['', [Validators.required]],
      MobileNo: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      DOB: ['', [Validators.required]],
      ParentName: ['', [Validators.required]],
      Mailingaddress: ['', [Validators.required]],
      State: ['', [Validators.required]],
      District: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Email: ['', [Validators.required,,Validators.email]],
      Pincode: ['', [Validators.required]],
      MDMobile: ['', [Validators.required,Validators.pattern(/^\d{10}$/)]],
      PrimaryLanguage: ['', [Validators.required]],
      PrimaryLangOthers: [''],
      WritingLanguage: ['', [Validators.required]],
      WritingLangOthers: ['', ],
    });
  }

  

  onRegisterPost(){
    
    this.registerForm.markAllAsTouched(); 
    if (this.registerForm.invalid){
      this.setErrorMessage("Fields marked in * are mandatory to fill.");
      return;
    }

    if(!this.validateQualifications()){
      return;
    }

    if(!this.validateExperiences()){
      return;
    }


    if(!this.validateDisciplines()){
      return;
    }
   

    if(!this.isaccepted){
      this.setErrorMessage("Please check the Terms and Condition checkbox.");
      return;
    }
    var allData = this.convertData(this.registerForm.value);
    console.log({'allData':allData});
    this.authservice.postRegisterData(allData).subscribe({
      next:(res:any)=>{
        console.log({'res':res});
        this.successmessage= "We appreciate your time in filling up the application for the ZED Training Program.Your application will be shortly processed. Please note that participation is  based on fulfilling the Eligibility Criteria and subjected to the availability of seat in the preferred Training Program. We will soon get back to you, once your application gets shortlisted. Your registered email id is "+this.registerForm.value.Email+"."
      },
      error:(err)=>{  
        //console.log({'err':err})
        this.setErrorMessage(err.error ? err.error:'Fail to save registration data.');
      }
    });
   }

   validateQualifications(){
      if(this.qualificationCollection.length <=0){
        this.setErrorMessage("Education qualification required.");
        return false;
      }

      return true;
   }

   validateExperiences(){
    let returnVal = true;
      if(this.selectedRole == "Assessor" && this.experienceCollection.length < 3){
          this.setErrorMessage("Please select Details of the Other relevant training for Assessor.");
          returnVal = false;
      }
      

      if(this.selectedRole == "ZEDConsultant" && this.experienceCollection.length < 2){
          this.setErrorMessage("Please select Details of the Other relevant training for Consultant.");
          returnVal = false;
      }
      
      return returnVal;
   }

   validateDisciplines(){
      if(this.selectedRole == "ZEDConsultant" && this.selectedNomination == 'Freelancer' && this.skillsCollection.length < 10){
          this.setErrorMessage("Please select at least 10 ZED Disciplines.");
        return false;
      }
      else if(this.skillsCollection.length < 3){
          this.setErrorMessage("Please select at least 3 ZED Disciplines.");
        return false;
      }

    //Check Group
        var groupA= this.skillsCollection.find((s:any)=> s.disciplinegroup == 'A');
        if(!groupA){
          this.setErrorMessage("Please select at least 1 ZED Discipline from Group A.");
           return false;
        }

        var groupB= this.skillsCollection.find((s:any)=> s.disciplinegroup == 'B');
        if(!groupB){
          this.setErrorMessage("Please select at least 1 ZED Discipline from Group B.");
           return false;
        }

        var groupC= this.skillsCollection.find((s:any)=> s.disciplinegroup == 'C');
        if(!groupC){
          this.setErrorMessage("Please select at least 1 ZED Discipline from Group C.");
           return false;
        }

        return true;
   }


   setErrorMessage(message:string){
      this.errormessage=message;
      setTimeout(() => {
        this.errormessage='';
      }, 5000);
   }

   convertData(formData:any){
      let newObj={
          AadhaarNo:formData.MobileNo,
          Agency:'64',
          ApplyingFor:formData.role,
          AreaOfKnowledgeOrExpertise:(this.experienceCollection.length ? this.experienceCollection.map((dt:any) => dt.knowledge).join(', '):''),
          CBIBCRAName:formData.accessorcbidcra,
          City:formData.City,
          ContactNumber:formData.MDMobile,
          CoordinatorEmail:formData.coordinatoremail,
          CoordinatorName:formData.coordinatorname,
          CoordinatorPhone:formData.coordinatorphone,
          DOB:formData.DOB,
          District:formData.District,
          Email:formData.Email,
          Name:formData.FirstName,
          NominatedThrough:formData.nominatedthrough,
          SpokenLanguagePrimary:formData.PrimaryLanguage,
          State:formData.State,
          WrittenLanguagePrimary:formData.WritingLanguage,
          ZedDisciplines:(this.skillsCollection.length ? this.skillsCollection.map((dt:any) => dt.discipline).join(', '):''),
          data:JSON.stringify(this.getRawAllData()),
          // experienceCollection:this.experienceCollection,
          // qualificationCollection:this.qualificationCollection,
          // skillsCollection:this.skillsCollection,
          // formData:formData
      };
    return  newObj;
   }

   getRawAllData(){
    var allData={
      formData:this.registerForm.value,
      skills:this.skillsCollection,
      experience:this.experienceCollection,
      qualification:this.qualificationCollection
    }

    return allData;

    //var data=this.registerForm.value;
  }

   onTermAccept(value:any){
    console.log(value);
    console.log({'isaccepted':this.isaccepted});
   }

  bindDropDowns(){
    this.BindDDDocType();
    this.BindStateType();
    this.BindLanguage();
  }

  handleDOBChange(event: any){
  this.registerForm.controls['DOB'].setValue(event.dateStr);
  }

  BindDDDocType(){
    var options = this.helper.getIDProofDocumentType();
    options.forEach((element:string) => {
      this.IDProofDocumentTypeOptions.push({label:element,value:element});
    });
  }

  BindLanguage(){
    var languages = this.helper.getLanguage();
    languages.forEach(lang => {
        this.languageOptions.push({label:lang,value:lang});
    });
  }

  BindStateType(){
    var options = this.helper.getAllStates().subscribe({
      next:(response:any)=>{ 
        response.forEach((element:any) => {
            this.StateOptions.push({value:element.stateID,label: element.stateName});
          });
      },
      error:(error)=>{ 
      }
    });    
  }

  loadDistrictByStates(stateId:string){
    this.districtOptions=[];
    this.helper.getDistrictByStates(stateId).subscribe({
        next:(response:any)=>{
          console.log({'response district':response});
          response.forEach((element:any) => {
            this.districtOptions.push({value:element.districtname,label: element.districtname});
          });
        },
        error: (error:any) => {console.error('Error:', error)
        //this.errormessage='Login failed. Please try again';//error.message;
        
      }
    });
  }

  nominatedthrough(value:any){
    this.registerForm.controls['idproofphoto'].setValue(value);
  }

  handleIDProofDocTypeSelectChange(value:any){
    console.log({'value':value});
    this.IdProofSeelcted=value;
    this.registerForm.controls['idproofdoctype'].setValue(value);
  }


handlePrimaryLangSelectChange(value:any){
    console.log({'value':value});
    this.speakinglangSelect=value;
    this.registerForm.controls['PrimaryLanguage'].setValue(value);
  }

  handlePrimaryWriteLangSelectChange(value:any){
    console.log({'value':value});
    this.writinglangSelect=value;
    this.registerForm.controls['WritingLanguage'].setValue(value);
  }


  handleStateChange(value:any){
    console.log({'value':value});
    this.SelectedState=value;
    this.districtSelect=''
    var st = this.StateOptions.find((s:any)=> s.value == value);
    console.log({'st':st});
    if(st){
      this.registerForm.controls['State'].setValue(st.label);
    }
    

    this.loadDistrictByStates(this.SelectedState);
  }

  handleDistrictChange(value:any){
    console.log({'value':value});
    this.districtSelect=value;
    this.registerForm.controls['District'].setValue(value);
    
  }



selectedRole: string = 'option2';
  handleRadioChange(value: string) {
    console.log(value,'role value')
    this.selectedRole = value;
    this.registerForm.controls['role'].setValue(value);
  }

  selectedNomination: string = 'option2';
  handleNominationRadioChange(value: string) {
    console.log(value,'Nomination value')
    this.selectedNomination = value;
    this.registerForm.controls['nominatedthrough'].setValue(value);
  }


async  handlePhotoChange(event: Event){
 const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    console.log('Selected file:', file);
    if (file) {
      // Convert bytes to KB: 1 KB = 1024 bytes
      var kbsize= Math.round(file.size / 1024);
      console.log({'kbsize':kbsize});
      if(kbsize > 2000){
        alert('File size is greater than 2000kb');    
        return    
      }

      if (!file.type.startsWith('image/')) {
    return;
  }
  
  this.imagePreview = URL.createObjectURL(file);
      this.IdProofPhoto=file;      
    //this.registerForm.controls['profileimage'].setValue(file);
    this.registerForm.controls['profileimage'].setValue(await this.helper.convertFileToBase64(file));
    }
}

async handleIdProofPhotoChange(event: Event){
 const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      var kbsize= Math.round(file.size / 1024);
      if(kbsize > 500){
        alert('File size is greater than 500kb');    
        return    
      }
      this.IdProofPhoto=file;
      console.log('Selected file:', file.name);
      //this.registerForm.controls['idproofphoto'].setValue(file);
      this.registerForm.controls['idproofphoto'].setValue(await this.helper.convertFileToBase64(file));
    }
}


   onFacultySelected(tempUser: any): void {
    //this.selectedFaculty = faculty;
    console.log('Parent received faculty:', tempUser);
    this.email=tempUser.email;
    this.contactno=tempUser.mobile;
    this.post=tempUser.applyfor;
    this.registerForm.controls['MDMobile'].setValue(tempUser.mobile);
    this.registerForm.controls['Email'].setValue(tempUser.email);
    this.handleRadioChange((tempUser.applyfor == 'Consultant'? 'ZEDConsultant' :tempUser.applyfor));
  }

   onCollectQualification(qualifications: any): void {
    //this.selectedFaculty = faculty;
    this.qualificationCollection=qualifications;
    console.log('qualifications received:', qualifications);
    
  }

   onCollectExperience(experience: any): void {
    //this.selectedFaculty = faculty;
    this.experienceCollection=experience;
    console.log('experience received:', experience);    
  }

   onCollectSkills(skills: any): void {
    this.skillsCollection=skills;
    console.log('skills received:', skills);    
  }

}

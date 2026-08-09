import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { RadioComponent } from '../../../shared/components/form/input/radio.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { FileInputComponent } from '../../../shared/components/form/input/file-input.component';
import { ImageInputComponent } from '../../../shared/components/form/input/image-input.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../../shared/components/form/date-picker/date-picker.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { QualificationComponent } from './qualification/qualification.component';
import { ExperienceComponent } from './experience/experience.component';
import { TechnicalskillsComponent } from './technicalskills/technicalskills.component';
import { IndustryExperienceComponent } from './industry-experience/industry-experience.component';
import { RoleExperienceComponent } from './role-experience/role-experience.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { HelperService } from '../../../services/helper.service';
import { AuthService } from '../../../services/auth.service';
import { RegistrationStepConfigService } from '../../../services/registration-step-config.service';
import { ParticipantService, ApplicationStatus } from '../../../services/participant.service';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';

interface RegistrationStep {
  key: string;
  name: string;
  order: number;
}

const STEP_CONTROLS: Record<string, string[]> = {
  role_photo:          ['role', 'profileimage'],
  id_proof:            ['idproofdoctype', 'docnumber', 'nameondocument', 'idproofphoto'],
  nomination:          ['nominatedthrough', 'coordinatorname', 'coordinatoremail', 'coordinatorphone'],
  personal_details:    ['FirstName', 'LastName', 'MobileNo', 'DOB', 'AadhaarNo'],
  mailing_address:     ['Mailingaddress', 'State', 'District', 'City', 'Pincode', 'MDMobile', 'Email'],
  languages:           ['PrimaryLanguage', 'WritingLanguage'],
  qualifications:      [],
  experience:          [],
  industry_experience: [],
  technical_skills:    [],
  role_experience:     [],
  declaration:         ['summaryofskillsets'],
};

@Component({
  selector: 'app-master-register',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentCardComponent,
    AlertComponent,
    RadioComponent,
    LabelComponent,
    FileInputComponent,
    ImageInputComponent,
    SelectComponent,
    DatePickerComponent,
    CheckboxComponent,
    QualificationComponent,
    ExperienceComponent,
    TechnicalskillsComponent,
    IndustryExperienceComponent,
    RoleExperienceComponent,
    DataloadinprogressComponent
  ],
  templateUrl: './master-register.component.html',
  styleUrl: './master-register.component.css',
})
export class MasterRegisterComponent implements OnInit {

  registerForm!: FormGroup;
  enabledSteps: RegistrationStep[] = [];
  currentStepIndex = 0;
  stepsLoading = true;

  // form state
  orgCategory: number | null = null;
  orgSubCategory: number | null = null;
  orgCategoryLabel = '';
  orgSubCategoryLabel = '';
  selectedRole = '';
  selectedNomination = '';
  maxDOB: Date = (() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d; })();
  imagePreview: string | null = null;
  IdProofPhoto: any;
  IDProofDocumentTypeOptions: any[] = [];
  IdProofSeelcted = '';
  StateOptions: any[] = [];
  SelectedState = '';
  districtOptions: any[] = [];
  districtSelect = '';
  languageOptions: any[] = [];
  speakinglangSelect = '';
  writinglangSelect = '';
  qualificationCollection: any[] = [];
  experienceCollection: any[] = [];
  industryExperienceCollection: any[] = [];
  skillsCollection: any[] = [];
  roleExperienceCollection: any = {};
  isaccepted = false;
  draftRestored = false;
  errormessage = '';
  successmessage = '';

  editMode = false;
  editingRegistrationId: number | null = null;
  isSaving = false;
  submitting = false;

  applicationStatusLoading = true;
  alreadyApplied = false;
  applicationStatus: ApplicationStatus | null = null;

  private fileServerBase = environment.apiurl.replace(/\/api$/, '');

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    private authservice: AuthService,
    private stepConfigService: RegistrationStepConfigService,
    private participantService: ParticipantService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.createForm();
    this.bindDropDowns();
    this.wireNominationValidators();

    this.orgCategory = this.helper.getOrgCategoryId();
    this.orgSubCategory = this.helper.getOrgSubCategoryId();

    const categoryValue = this.helper.getUser()?.orgCategory ?? null;
    const subCategoryValue = this.helper.getOrgSubCategoryValue();
    this.orgCategoryLabel = categoryValue ?? '';
    this.orgSubCategoryLabel = subCategoryValue ?? '';

    this.selectedRole = subCategoryValue ? String(subCategoryValue) : '';
    this.registerForm.controls['role'].setValue(subCategoryValue ? String(subCategoryValue) : '');

    const userEmail = this.helper.getUserEmail();
    if (userEmail) {
      this.registerForm.controls['Email'].setValue(userEmail);
    }

    this.editMode = this.route.snapshot.queryParamMap.get('edit') === 'true';

    if (this.editMode) {
      this.loadExistingApplication();
    } else {
      this.participantService.getApplicationStatus().subscribe({
        next: (status) => {
          this.applicationStatus = status;
          const blockedStatuses = ['Applied', 'Active'];
          this.alreadyApplied = status.hasApplied && blockedStatuses.includes(status.participantStatus ?? '');
          this.applicationStatusLoading = false;
          if (!this.alreadyApplied) {
            this.initDraft();
          }
        },
        error: () => {
          this.applicationStatusLoading = false;
          this.initDraft();
        }
      });
    }

    this.stepConfigService.getStepsForParticipant(categoryValue, subCategoryValue).subscribe({
      next: (steps: any[]) => {
        this.enabledSteps = steps;
        this.stepsLoading = false;
      },
      error: () => {
        this.enabledSteps = [
          { key: 'role_photo',          name: 'Role & Profile Photo',       order: 1 },
          { key: 'id_proof',            name: 'ID Proof',                   order: 2 },
          { key: 'nomination',          name: 'Nominated Through',          order: 3 },
          { key: 'personal_details',    name: 'Personal Details',           order: 4 },
          { key: 'mailing_address',     name: 'Mailing Address',            order: 5 },
          { key: 'languages',           name: 'Languages',                  order: 6 },
          { key: 'qualifications',      name: 'Educational Qualifications', order: 7 },
          { key: 'experience',          name: 'Work Experience',            order: 8 },
          { key: 'industry_experience', name: 'Industry Experience',        order: 9 },
          { key: 'technical_skills',    name: 'Technical Skills',           order: 10 },
          { key: 'role_experience',     name: 'Role Experience',            order: 11 },
          { key: 'declaration',         name: 'Declaration & Submit',       order: 12 },
        ];
        this.stepsLoading = false;
      }
    });
  }

  get currentStep(): RegistrationStep | null {
    return this.enabledSteps[this.currentStepIndex] ?? null;
  }

  isCurrentStep(key: string): boolean {
    return this.currentStep?.key === key;
  }

  get isLastStep(): boolean {
    return this.currentStepIndex === this.enabledSteps.length - 1;
  }

  get progressPercent(): number {
    if (!this.enabledSteps.length) return 0;
    return Math.round(((this.currentStepIndex + 1) / this.enabledSteps.length) * 100);
  }

  next() {
    if (!this.validateCurrentStep()) return;
    if (this.isLastStep) {
      this.finalSubmit();
    } else {
      this.saveCurrentStep(() => {
        this.currentStepIndex++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  back() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Draft initialisation (new application flow) ────────────────────────────

  private initDraft() {
    this.participantService.startApplication().subscribe({
      next: (res) => {
        this.editingRegistrationId = res.registrationId;
        this.loadProgressFromServer(res.lastSavedStep);
      },
      error: () => {
        // Fall back to localStorage draft if API unreachable
        this.restoreDraftFromLocalStorage();
      }
    });
  }

  private loadProgressFromServer(lastSavedStep: string | null) {
    this.participantService.getApplicationProgress().subscribe({
      next: (progress: any) => {
        if (progress) {
          this.prefillFromProgressData(progress);
          // Resume at the step after the last saved one
          if (lastSavedStep && this.enabledSteps.length > 0) {
            const savedIdx = this.enabledSteps.findIndex(s => s.key === lastSavedStep);
            if (savedIdx >= 0 && savedIdx < this.enabledSteps.length - 1) {
              this.currentStepIndex = savedIdx + 1;
            }
          }
          this.draftRestored = !!lastSavedStep;
        }
      },
      error: () => {
        this.restoreDraftFromLocalStorage();
      }
    });
  }

  private prefillFromProgressData(p: any) {
    this.registerForm.patchValue({
      profileimage:      p.profileImagePath     ?? '',
      idproofdoctype:    p.idProofDocType        ?? '',
      docnumber:         p.idProofDocNumber      ?? '',
      nameondocument:    p.nameOnDocument        ?? '',
      idproofphoto:      p.idProofImagePath      ?? '',
      nominatedthrough:  p.nominatedThrough      ?? '',
      accessorcbidcra:   p.accessorCbidCra       ?? '',
      consultantorg:     p.consultantOrg         ?? '',
      coordinatorname:   p.coordinatorName       ?? '',
      coordinatoremail:  p.coordinatorEmail      ?? '',
      coordinatorphone:  p.coordinatorPhone      ?? '',
      FirstName:         p.firstName             ?? '',
      MiddleName:        p.middleName            ?? '',
      LastName:          p.lastName              ?? '',
      MobileNo:          p.mobileNo              ?? '',
      DOB:               p.dob                   ?? '',
      ParentName:        p.parentName            ?? '',
      AadhaarNo:         p.aadhaarNo             ?? '',
      Mailingaddress:    p.mailingAddress        ?? '',
      State:             p.state                 ?? '',
      District:          p.district              ?? '',
      City:              p.city                  ?? '',
      Pincode:           p.pincode               ?? '',
      MDMobile:          p.mdMobile              ?? '',
      Email:             p.email                 ?? this.helper.getUserEmail() ?? '',
      PrimaryLanguage:   p.primaryLanguage       ?? '',
      PrimaryLangOthers: p.primaryLangOthers     ?? '',
      WritingLanguage:   p.writingLanguage        ?? '',
      WritingLangOthers: p.writingLangOthers      ?? '',
      summaryofskillsets: p.summaryOfSkillSets   ?? '',
      otherinformation:   p.otherInformation     ?? '',
    });

    this.selectedNomination = p.nominatedThrough ?? '';
    this.IdProofSeelcted    = p.idProofDocType   ?? '';
    this.speakinglangSelect = p.primaryLanguage  ?? '';
    this.writinglangSelect  = p.writingLanguage  ?? '';

    if (p.profileImagePath) {
      this.imagePreview = this.fileServerBase + p.profileImagePath;
    }

    if (p.state) {
      const st = this.StateOptions.find((s: any) => s.label === p.state);
      if (st) {
        this.SelectedState = st.value;
        this.helper.getDistrictByStates(this.SelectedState).subscribe({
          next: (res: any[]) => {
            this.districtOptions = res.map(d => ({ value: d.districtname, label: d.districtname }));
            this.districtSelect = p.district ?? '';
          }
        });
      }
    }

    this.qualificationCollection      = p.qualifications        ?? [];
    this.experienceCollection         = p.experiences           ?? [];
    this.industryExperienceCollection = p.industryExperiences   ?? [];
    this.skillsCollection             = p.skills                ?? [];
    this.roleExperienceCollection     = p.roleExperience        ?? {};
  }

  // ── Edit mode: load existing application ──────────────────────────────────

  private loadExistingApplication() {
    this.participantService.getApplicationProgress().subscribe({
      next: (progress: any) => {
        if (progress) {
          this.editingRegistrationId = progress.registrationId;
          this.prefillFromProgressData(progress);
        }
        this.applicationStatusLoading = false;
      },
      error: () => {
        // Legacy fallback: load from old blob endpoint
        this.participantService.getMyApplication().subscribe({
          next: (data: any) => {
            this.editingRegistrationId = data.id ?? null;
            this.prefillFromLegacyBlobData(data);
            this.applicationStatusLoading = false;
          },
          error: () => { this.applicationStatusLoading = false; }
        });
      }
    });
  }

  private prefillFromLegacyBlobData(data: any) {
    let parsed: any = {};
    try { parsed = data.data ? JSON.parse(data.data) : {}; } catch {}
    const f = parsed.formData ?? {};
    this.registerForm.patchValue(f);
    this.qualificationCollection      = parsed.qualification      ?? [];
    this.experienceCollection         = parsed.experience         ?? [];
    this.industryExperienceCollection = parsed.industryExperience ?? [];
    this.skillsCollection             = parsed.skills             ?? [];
    this.roleExperienceCollection     = parsed.roleExperience     ?? {};
    this.selectedNomination = f.nominatedthrough ?? '';
    this.IdProofSeelcted    = f.idproofdoctype   ?? '';
    this.speakinglangSelect = f.PrimaryLanguage  ?? '';
    this.writinglangSelect  = f.WritingLanguage  ?? '';
    if (f.profileimage) {
      this.imagePreview = this.fileServerBase + f.profileimage;
    }
    if (f.State) {
      const st = this.StateOptions.find((s: any) => s.label === f.State);
      if (st) {
        this.SelectedState = st.value;
        this.helper.getDistrictByStates(this.SelectedState).subscribe({
          next: (res: any[]) => {
            this.districtOptions = res.map(d => ({ value: d.districtname, label: d.districtname }));
            this.districtSelect = f.District ?? '';
          }
        });
      }
    }
  }

  // ── Per-step save ──────────────────────────────────────────────────────────

  private saveCurrentStep(onSuccess: () => void) {
    const key = this.currentStep?.key ?? '';
    const saveCall = this.buildStepSaveCall(key);
    if (!saveCall) {
      onSuccess();
      return;
    }
    this.isSaving = true;
    saveCall.subscribe({
      next: () => {
        this.isSaving = false;
        onSuccess();
      },
      error: (err: any) => {
        this.isSaving = false;
        this.setErrorMessage(err.error?.message ?? 'Failed to save step. Please try again.');
      }
    });
  }

  private buildStepSaveCall(key: string): any {
    const f = this.registerForm.value;
    switch (key) {
      case 'role_photo':
        return this.participantService.saveStepPhoto({ profileImagePath: f.profileimage });

      case 'id_proof':
        return this.participantService.saveStepIdProof({
          idProofDocType: f.idproofdoctype,
          idProofDocNumber: f.docnumber,
          nameOnDocument: f.nameondocument,
          idProofImagePath: f.idproofphoto,
        });

      case 'nomination':
        return this.participantService.saveStepNomination({
          nominatedThrough: f.nominatedthrough,
          accessorCbidCra:  f.accessorcbidcra,
          consultantOrg:    f.consultantorg,
          coordinatorName:  f.coordinatorname,
          coordinatorEmail: f.coordinatoremail,
          coordinatorPhone: f.coordinatorphone,
        });

      case 'personal_details':
        return this.participantService.saveStepPersonal({
          firstName:  f.FirstName,
          middleName: f.MiddleName,
          lastName:   f.LastName,
          mobileNo:   f.MobileNo,
          dOB:        f.DOB,
          parentName: f.ParentName,
          aadhaarNo:  f.AadhaarNo,
        });

      case 'mailing_address':
        return this.participantService.saveStepAddress({
          mailingAddress: f.Mailingaddress,
          state:          f.State,
          district:       f.District,
          city:           f.City,
          pincode:        f.Pincode,
          mDMobile:       f.MDMobile,
          email:          f.Email,
        });

      case 'languages':
        return this.participantService.saveStepLanguages({
          primaryLanguage:   f.PrimaryLanguage,
          primaryLangOthers: f.PrimaryLangOthers,
          writingLanguage:   f.WritingLanguage,
          writingLangOthers: f.WritingLangOthers,
        });

      case 'qualifications':
        return this.participantService.saveStepQualifications({ qualifications: this.qualificationCollection });

      case 'experience':
        return this.participantService.saveStepExperience({ experiences: this.experienceCollection });

      case 'industry_experience':
        return this.participantService.saveStepIndustryExperience({ industryExperiences: this.industryExperienceCollection });

      case 'technical_skills':
        return this.participantService.saveStepSkills({ skills: this.skillsCollection });

      case 'role_experience':
        return this.participantService.saveStepRoleExperience(this.roleExperienceCollection);

      case 'declaration':
        return this.participantService.saveStepDeclaration({
          summaryOfSkillSets: f.summaryofskillsets,
          otherInformation:   f.otherinformation,
        });

      default:
        return null;
    }
  }

  // ── Final submit ───────────────────────────────────────────────────────────

  private finalSubmit() {
    // Save the last step first, then submit
    this.saveCurrentStep(() => {
      this.submitting = true;
      this.participantService.submitApplication().subscribe({
        next: () => {
          this.submitting = false;
          if (this.editMode) {
            this.router.navigate(['/participant/myapplication']);
          } else {
            this.successmessage =
              'We appreciate your time in filling up the application. Your application will be shortly processed. ' +
              'Participation is based on fulfilling the Eligibility Criteria and seat availability. ' +
              'Your registered email is ' + this.registerForm.value.Email + '.';
          }
        },
        error: (err: any) => {
          this.submitting = false;
          this.setErrorMessage(err.error?.message ?? 'Failed to submit application. Please try again.');
        }
      });
    });
  }

  cancelEdit() {
    this.router.navigate(['/participant/myapplication']);
  }

  // ── localStorage fallback (secondary, for offline resilience) ──────────────

  private get draftKey(): string {
    return `master_register_draft_${this.helper.getUserEmail()}`;
  }

  private restoreDraftFromLocalStorage() {
    const raw = localStorage.getItem(this.draftKey);
    if (!raw) { this.applicationStatusLoading = false; return; }
    try {
      const d = JSON.parse(raw);
      this.registerForm.patchValue(d.formValues ?? {});
      this.currentStepIndex             = d.stepIndex ?? 0;
      this.selectedNomination           = d.selectedNomination ?? '';
      this.IdProofSeelcted              = d.IdProofSeelcted ?? '';
      this.SelectedState                = d.SelectedState ?? '';
      this.districtSelect               = d.districtSelect ?? '';
      this.speakinglangSelect           = d.speakinglangSelect ?? '';
      this.writinglangSelect            = d.writinglangSelect ?? '';
      this.qualificationCollection      = d.qualificationCollection      ?? [];
      this.experienceCollection         = d.experienceCollection         ?? [];
      this.industryExperienceCollection = d.industryExperienceCollection ?? [];
      this.skillsCollection             = d.skillsCollection             ?? [];
      this.roleExperienceCollection     = d.roleExperienceCollection     ?? {};
      this.isaccepted                   = d.isaccepted ?? false;
      if (d.formValues?.profileimage) {
        this.imagePreview = this.fileServerBase + d.formValues.profileimage;
      }
      if (this.SelectedState) {
        this.helper.getDistrictByStates(this.SelectedState).subscribe({
          next: (res: any[]) => res.forEach(dist =>
            this.districtOptions.push({ value: dist.districtname, label: dist.districtname }))
        });
      }
      this.draftRestored = true;
    } catch {
      localStorage.removeItem(this.draftKey);
    }
    this.applicationStatusLoading = false;
  }

  clearDraft() {
    localStorage.removeItem(this.draftKey);
    this.draftRestored = false;
  }

  // ── Validation ─────────────────────────────────────────────────────────────

  validateCurrentStep(): boolean {
    const key = this.currentStep?.key ?? '';
    const controls = STEP_CONTROLS[key] ?? [];

    controls.forEach(name => this.registerForm.get(name)?.markAsTouched());

    const invalid = controls.some(name => this.registerForm.get(name)?.invalid);
    if (invalid) {
      this.setErrorMessage('Please fill in all required fields before proceeding.');
      return false;
    }

    if (key === 'qualifications' && this.qualificationCollection.length === 0) {
      this.setErrorMessage('Please add at least one educational qualification.');
      return false;
    }

    if (key === 'industry_experience' && this.industryExperienceCollection.length === 0) {
      this.setErrorMessage('Please add at least one industry experience entry.');
      return false;
    }

    if (key === 'experience' && !this.validateExperiences()) return false;
    if (key === 'technical_skills' && !this.validateDisciplines()) return false;

    if (key === 'declaration' && !this.isaccepted) {
      this.setErrorMessage('Please accept the declaration before submitting.');
      return false;
    }

    return true;
  }

  // ── Form setup ─────────────────────────────────────────────────────────────

  createForm() {
    this.registerForm = this.fb.group({
      role:              ['', Validators.required],
      profileimage:      ['', Validators.required],
      idproofdoctype:    ['', Validators.required],
      docnumber:         ['', Validators.required],
      nameondocument:    ['', Validators.required],
      idproofphoto:      ['', Validators.required],
      nominatedthrough:  ['', Validators.required],
      accessorcbidcra:   [''],
      consultantorg:     [''],
      coordinatorname:   [''],
      coordinatoremail:  [''],
      coordinatorphone:  [''],
      FirstName:         ['', Validators.required],
      MiddleName:        [''],
      LastName:          ['', Validators.required],
      MobileNo:          ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      DOB:               ['', Validators.required],
      ParentName:        [''],
      AadhaarNo:         ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      Mailingaddress:    ['', Validators.required],
      State:             ['', Validators.required],
      District:          ['', Validators.required],
      City:              ['', Validators.required],
      Pincode:           ['', Validators.required],
      MDMobile:          ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      Email:             ['', [Validators.required, Validators.email]],
      PrimaryLanguage:      ['', Validators.required],
      PrimaryLangOthers:    [''],
      WritingLanguage:      ['', Validators.required],
      WritingLangOthers:    [''],
      summaryofskillsets:   ['', [Validators.required, Validators.maxLength(500)]],
      otherinformation:     ['', [Validators.maxLength(500)]],
    });
  }

  wireNominationValidators() {
    this.registerForm.get('nominatedthrough')?.valueChanges.subscribe(value => {
      const coordinatorname  = this.registerForm.get('coordinatorname');
      const coordinatoremail = this.registerForm.get('coordinatoremail');
      const coordinatorphone = this.registerForm.get('coordinatorphone');

      if (value && value !== 'Freelancer') {
        coordinatorname?.setValidators([Validators.required]);
        coordinatoremail?.setValidators([Validators.required, Validators.email]);
        coordinatorphone?.setValidators([Validators.required, Validators.pattern(/^\d{10}$/)]);
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

  // ── Dropdowns ──────────────────────────────────────────────────────────────

  bindDropDowns() {
    this.helper.getIDProofDocumentType().forEach((el: string) =>
      this.IDProofDocumentTypeOptions.push({ label: el, value: el }));

    this.helper.getLanguage().forEach((lang: string) =>
      this.languageOptions.push({ label: lang, value: lang }));

    this.helper.getAllStates().subscribe({
      next: (res: any[]) => res.forEach(s =>
        this.StateOptions.push({ value: s.stateID, label: s.stateName }))
    });
  }

  // ── Event handlers ─────────────────────────────────────────────────────────

  handleNominationRadioChange(value: string) {
    this.selectedNomination = value;
    this.registerForm.controls['nominatedthrough'].setValue(value);
  }

  handleIDProofDocTypeSelectChange(value: any) {
    this.IdProofSeelcted = value;
    this.registerForm.controls['idproofdoctype'].setValue(value);
  }

  handleDOBChange(event: any) {
    this.registerForm.controls['DOB'].setValue(event.dateStr);
  }

  handleStateChange(value: any) {
    this.SelectedState = value;
    this.districtSelect = '';
    const st = this.StateOptions.find((s: any) => s.value == value);
    if (st) this.registerForm.controls['State'].setValue(st.label);
    this.districtOptions = [];
    this.helper.getDistrictByStates(this.SelectedState).subscribe({
      next: (res: any[]) => res.forEach(d =>
        this.districtOptions.push({ value: d.districtname, label: d.districtname }))
    });
  }

  handleDistrictChange(value: any) {
    this.districtSelect = value;
    this.registerForm.controls['District'].setValue(value);
  }

  handlePrimaryLangSelectChange(value: any) {
    this.speakinglangSelect = value;
    this.registerForm.controls['PrimaryLanguage'].setValue(value);
  }

  handlePrimaryWriteLangSelectChange(value: any) {
    this.writinglangSelect = value;
    this.registerForm.controls['WritingLanguage'].setValue(value);
  }

  handlePhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (Math.round(file.size / 1024) > 2000) { alert('File size exceeds 2000 KB.'); return; }
    if (!file.type.startsWith('image/')) return;
    this.imagePreview = URL.createObjectURL(file);
    this.apiService.uploadParticipantFile(file, 'profile').subscribe({
      next: (res) => this.registerForm.controls['profileimage'].setValue(res.path),
      error: () => {
        this.imagePreview = null;
        this.registerForm.controls['profileimage'].setValue('');
        this.setErrorMessage('Failed to upload profile photo. Please try again.');
      }
    });
  }

  handleIdProofPhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (Math.round(file.size / 1024) > 500) { alert('File size exceeds 500 KB.'); return; }
    this.apiService.uploadParticipantFile(file, 'idproof').subscribe({
      next: (res) => this.registerForm.controls['idproofphoto'].setValue(res.path),
      error: () => {
        this.registerForm.controls['idproofphoto'].setValue('');
        this.setErrorMessage('Failed to upload ID proof. Please try again.');
      }
    });
  }

  onCollectQualification(qualifications: any)       { this.qualificationCollection = qualifications; }
  onCollectExperience(experience: any)              { this.experienceCollection = experience; }
  onCollectIndustryExperience(experience: any)      { this.industryExperienceCollection = experience; }
  onCollectSkills(skills: any)                      { this.skillsCollection = skills; }
  onCollectRoleExperience(data: any)                { this.roleExperienceCollection = data; }
  onTermAccept(value: any)                          { this.isaccepted = value; }

  // ── Validation helpers ─────────────────────────────────────────────────────

  validateExperiences(): boolean {
    return true;
  }

  validateDisciplines(): boolean {
    const hasA = this.skillsCollection.some((s: any) => s.disciplinegroup === 'A');
    const hasB = this.skillsCollection.some((s: any) => s.disciplinegroup === 'B');
    const hasC = this.skillsCollection.some((s: any) => s.disciplinegroup === 'C');
    const missing = [!hasA && 'A', !hasB && 'B', !hasC && 'C'].filter(Boolean).join(', ');
    if (missing) {
      this.setErrorMessage(`Please add at least one discipline from each category. Missing: Category ${missing}.`);
      return false;
    }
    return true;
  }

  setErrorMessage(message: string) {
    this.errormessage = message;
    setTimeout(() => this.errormessage = '', 5000);
  }
}

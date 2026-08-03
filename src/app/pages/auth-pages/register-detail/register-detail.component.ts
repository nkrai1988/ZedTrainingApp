import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FacultyService } from '../../../services/faculty.service';
import { HelperService } from '../../../services/helper.service';
import { ParticipantService } from '../../../services/participant.service';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { DataloadinprogressComponent } from '../../../shared/components/common/dataloadinprogress/dataloadinprogress.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register-detail',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ModalComponent,
    ButtonComponent,
    AlertComponent,
    DataloadinprogressComponent,
  ],
  templateUrl: './register-detail.component.html',
  styleUrl: './register-detail.component.css',
})
export class RegisterDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private facultyService: FacultyService,
    public helperService: HelperService,
    private participantService: ParticipantService,
  ) {}

  registerId = '';
  participantMode = false;
  redirectReason: 'incomplete' | 'rejected' | null = null;

  detail: any = null;
  loading = true;
  successMessage = '';
  activeTab = 'overview';

  qualifications: any[] = [];
  experience: any[] = [];
  industryExperience: any[] = [];
  skills: any[] = [];
  roleExperience: any = {};
  formData: any = {};

  isOpen = false;
  statusComment = '';
  statusCommentBtnClick = false;

  readonly fileServerBase = environment.apiurl.replace(/\/api$/, '');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.registerId = id;
      this.participantMode = false;
      this.loadDetail();
    } else {
      this.participantMode = true;
      const reason = this.route.snapshot.queryParamMap.get('reason');
      if (reason === 'incomplete' || reason === 'rejected') {
        this.redirectReason = reason;
      }
      this.loadMyApplication();
    }
  }

  loadDetail() {
    this.loading = true;
    this.authService.getRegisterDetailData(this.registerId).subscribe({
      next: (res: any) => {
        this.detail = res;
        if (Array.isArray(res.qualifications)) {
          this.mapProgressResponse(res);
        } else {
          this.parseJsonData(res.data);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  loadMyApplication() {
    this.loading = true;
    this.participantService.getMyApplication().subscribe({
      next: (res: any) => {
        this.detail = res;
        if (Array.isArray(res.qualifications)) {
          this.mapProgressResponse(res);
        } else {
          this.parseJsonData(res.data);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private mapProgressResponse(res: any): void {
    this.formData = {
      profileimage:     res.profileImagePath,
      idproofphoto:     res.idProofImagePath,
      idproofdoctype:   res.idProofDocType,
      docnumber:        res.idProofDocNumber,
      nameondocument:   res.nameOnDocument,
      nominatedthrough: res.nominatedThrough,
      accessorcbidcra:  res.accessorCbidCra,
      consultantorg:    res.consultantOrg,
      coordinatorname:  res.coordinatorName,
      coordinatoremail: res.coordinatorEmail,
      coordinatorphone: res.coordinatorPhone,
      FirstName:  res.firstName,
      MiddleName: res.middleName,
      LastName:   res.lastName,
      ParentName: res.parentName,
      DOB:        res.dob,
      AadhaarNo:  res.aadhaarNo,
      MobileNo:   res.mobileNo,
      Mailingaddress: res.mailingAddress,
      State:    res.state,
      District: res.district,
      City:     res.city,
      Pincode:  res.pincode,
      Email:    res.email,
      MDMobile: res.mDMobile,
      PrimaryLanguage:   res.primaryLanguage,
      PrimaryLangOthers: res.primaryLangOthers,
      WritingLanguage:   res.writingLanguage,
      WritingLangOthers: res.writingLangOthers,
      summaryofskillsets: res.summaryOfSkillSets,
      otherinformation:   res.otherInformation,
    };

    this.qualifications = (res.qualifications ?? []).map((q: any) => ({
      year:          [q.startDate, q.endDate].filter(Boolean).join(' – '),
      institue:      q.institution,
      qualification: q.qualification,
      grade:         q.grade,
      document:      q.documentPath,
    }));

    this.experience = (res.experiences ?? []).map((e: any) => ({
      durationyear:    e.durationYear,
      durationmonth:   e.durationMonth,
      organizationname: e.organizationName,
      role:            e.role,
      experience:      e.experienceType,
      trainingname:    e.trainingName,
      knowledge:       e.knowledgeArea,
      proof:           e.proofPath,
    }));

    this.industryExperience = (res.industryExperiences ?? []).map((e: any) => ({
      ...e,
      proof: e.proofPath,
    }));

    this.skills = (res.skills ?? []).map((s: any) => ({
      discipline:      s.discipline,
      disciplinegroup: s.disciplineGroup,
      disciplinemeta:  { group: s.disciplineGroup, description: s.disciplineDescription },
      experiencetype:  s.experienceType,
      trainingname:    s.trainingName,
      Organization:    s.organization,
      conductedby:     s.conductedBy,
      role:            s.role,
      durationyear:    s.durationYear,
      durationmonth:   s.durationMonth,
      durationday:     s.durationDay,
      proof:           s.proofPath,
    }));

    const re = res.roleExperience ?? {};
    this.roleExperience = {
      trainingRows: (re.trainingRows ?? []).map((r: any) => ({
        trainingname:   r.trainingName,
        organization:   r.organization,
        responsibilities: r.responsibilities,
        zeddisciplines: r.zedDisciplines,
        sector:         r.sector,
        durationyear:   r.durationYear,
        durationmonth:  r.durationMonth,
      })),
      assessmentRows: (re.assessmentRows ?? []).map((r: any) => ({
        projectname:    r.projectName,
        organization:   r.organization,
        area:           r.area,
        sector:         r.sector,
        responsibilities: r.responsibilities,
        durationyear:   r.durationYear,
        durationmonth:  r.durationMonth,
        durationday:    r.durationDay,
        proof:          r.proofPath,
      })),
      consultancyRows: (re.consultancyRows ?? []).map((r: any) => ({
        projectname:    r.projectName,
        organization:   r.organization,
        area:           r.area,
        sector:         r.sector,
        responsibilities: r.responsibilities,
        durationyear:   r.durationYear,
        durationmonth:  r.durationMonth,
        durationday:    r.durationDay,
        proof:          r.proofPath,
      })),
      noOfAssessmentsDone:    re.noOfAssessmentsDone,
      noOfConsultanciesGiven: re.noOfConsultanciesGiven,
    };
  }

  private parseJsonData(raw: string | null) {
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      this.formData           = parsed.formData           ?? {};
      this.qualifications     = parsed.qualification      ?? [];
      this.experience         = parsed.experience         ?? [];
      this.industryExperience = parsed.industryExperience ?? [];
      this.skills             = parsed.skills             ?? [];
      this.roleExperience     = parsed.roleExperience     ?? {};
    } catch {}
  }

  setTab(tab: string) { this.activeTab = tab; }

  getStatusClass(status: string): string {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
    if (status === 'APPROVED') return `${base} bg-green-100 text-green-800`;
    if (status === 'REJECTED') return `${base} bg-red-100 text-red-800`;
    return `${base} bg-yellow-100 text-yellow-800`;
  }

  getStatusLabel(status: string): string {
    if (status === 'APPROVED') return 'Accepted';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending';
  }

  canApprove(): boolean {
    return this.detail?.status !== 'APPROVED' &&
      (this.helperService.IsSuperAdmin() || this.helperService.IsCategoryAdmin());
  }

  canReject(): boolean {
    return this.detail?.status !== 'REJECTED' &&
      (this.helperService.IsSuperAdmin() || this.helperService.IsCategoryAdmin());
  }

  canEdit(): boolean {
    return this.participantMode && this.detail?.status !== 'APPROVED';
  }

  accept() {
    if (!confirm('Accept this application?')) return;
    this.facultyService
      .updateRegistrationRecordStatus({ id: +this.registerId, status: 'APPROVED', comment: '' })
      .subscribe({
        next: () => {
          this.successMessage = 'Application accepted successfully.';
          this.loadDetail();
          setTimeout(() => (this.successMessage = ''), 5000);
        },
      });
  }

  openRejectModal() {
    this.statusComment = '';
    this.statusCommentBtnClick = false;
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.statusComment = '';
    this.statusCommentBtnClick = false;
  }

  confirmReject() {
    this.statusCommentBtnClick = true;
    if (!this.statusComment) return;
    this.facultyService
      .updateRegistrationRecordStatus({ id: +this.registerId, status: 'REJECTED', comment: this.statusComment })
      .subscribe({
        next: () => {
          this.successMessage = 'Application rejected.';
          this.closeModal();
          this.loadDetail();
          setTimeout(() => (this.successMessage = ''), 5000);
        },
      });
  }

  goBack() {
    if (this.participantMode) {
      this.router.navigate(['/participantdashboard']);
    } else {
      this.router.navigate(['/mtatcttrainer']);
    }
  }

  goToEdit() {
    this.router.navigate(['/register'], { queryParams: { edit: 'true' } });
  }

  fileUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return this.fileServerBase + path;
  }
}

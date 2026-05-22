import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { AgencylistComponent } from './pages/Agencies/agencylist/agencylist.component';
import { AgencydetailComponent } from './pages/Agencies/agencydetail/agencydetail.component';
import { FullScreenModalComponent } from './shared/components/ui-example/modal-example/full-screen-modal/full-screen-modal.component';
import { CurriculumlistComponent } from './pages/curriculum/curriculumlist/curriculumlist.component';
import { ProgrammeListComponent } from './pages/programme/programme-list/programme-list.component';
import { NewprogrammeComponent } from './pages/programme/newprogramme/newprogramme.component';
import { CoordinatorlistComponent } from './pages/coordinator/coordinatorlist/coordinatorlist.component';
import { CoordinatordetailComponent } from './pages/coordinator/coordinatordetail/coordinatordetail.component';
import { OrganisingPartnersComponent } from './pages/OrganisingPartner/organising-partners/organising-partners.component';
import { ChangepasswordComponent } from './pages/user/changepassword/changepassword.component';
import { SessionlistComponent } from './pages/curriculum/sessionlist/sessionlist.component';
import { TopiclistComponent } from './pages/curriculum/topiclist/topiclist.component';
import { QcapprovallistComponent } from './pages/qcapproval/qcapprovallist/qcapprovallist.component';
import { ViewreportComponent } from './pages/report/viewreport/viewreport.component';
import { SummaryreportComponent } from './pages/report/summaryreport/summaryreport.component';
import { ZedfacultyComponent } from './pages/faculty/zedfaculty/zedfaculty.component';
import { NewfacultyComponent } from './pages/faculty/newfaculty/newfaculty.component';
import { FacultyallotmentComponent } from './pages/faculty/facultyallotment/facultyallotment.component';
import { FacultydetailComponent } from './pages/faculty/facultydetail/facultydetail.component';
import { RegisterComponent } from './shared/components/auth/register/register.component';
import { MasterRegisterComponent } from './pages/auth-pages/master-register/master-register.component';
import { TrainingprogrammesComponent } from './pages/user/trainingprogrammes/trainingprogrammes.component';
import { TrainerlistComponent } from './pages/trainers/trainerlist/trainerlist.component';
import { RegisterDetailComponent } from './pages/auth-pages/register-detail/register-detail.component';
import { CertificateslistComponent } from './pages/Certificates/certificateslist/certificateslist.component';
import { QmpdashboardComponent } from './pages/dashboard/qmpdashboard/qmpdashboard.component';
import { AssessordashboardComponent } from './pages/dashboard/assessordashboard/assessordashboard.component';
import { ProgrammedetailComponent } from './pages/programme/programmedetail/programmedetail.component';
import { ProgrammeDetailComponent } from './pages/programme/programme-detail/programme-detail.component';
import { BatchVenueComponent } from './pages/programme/programme-detail/batch-venue/batch-venue.component';
import { BatchParticipantsComponent } from './pages/programme/programme-detail/batch-participants/batch-participants.component';
import { AdminProgrammListComponent } from './pages/programme/admin-programm-list/admin-programm-list.component';
import { UploadParticipantsBatchesComponent } from './pages/participants/upload-participants-batches/upload-participants-batches.component';
import { UploadParticipantsComponent } from './pages/participants/upload-participants/upload-participants.component';
import { ParticipantSignInComponent } from './pages/auth-pages/participant-sign-in/participant-sign-in.component';
import { ParticipantSignUpComponent } from './pages/auth-pages/participant-sign-up/participant-sign-up.component';
import { ParticipantDashboardComponent } from './pages/dashboard/participant-dashboard/participant-dashboard.component';
import { ParticipantLayoutComponent } from './shared/layout/participant-layout/participant-layout.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path: 'dashboard',
        component: DashboardComponent,
        pathMatch: 'full',
        title:'Training Solution',
        canActivate:[AuthGuard]
      },
      {
        path: 'prodashboard',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:'Training Solution',
        canActivate:[AuthGuard]
      },
      {
        path: 'qmpdashboard',
        component: QmpdashboardComponent,
        pathMatch: 'full',
        title:'Training Solution',
        canActivate:[AuthGuard]
      },
      {
        path: 'assessordashboard',
        component: AssessordashboardComponent,
        pathMatch: 'full',
        title:'Training Solution',
        canActivate:[AuthGuard]
      },
      {
        path: 'agencies',
        component: AgencylistComponent,
        pathMatch: 'full',
        title:'Agencies',
        canActivate:[AuthGuard]
      },
      {
        path: 'agenciesdetail',
        component: AgencydetailComponent,
        pathMatch: 'full',
        title:'Agency Detail',
        canActivate:[AuthGuard]
      },
      {
        path: 'agenciesdetail/:id',
        component: AgencydetailComponent,
        pathMatch: 'full',
        title:'Agency Detail',
        canActivate:[AuthGuard]
      },
      {
        path: 'curriculum',
        component: CurriculumlistComponent,
        pathMatch: 'full',
        title:'Agencies',
        canActivate:[AuthGuard]
      },
      {
        path: 'sessions',
        component: SessionlistComponent,
        pathMatch: 'full',
        title:'Session',
        canActivate:[AuthGuard]
      },
      {
        path: 'topics',
        component: TopiclistComponent,
        pathMatch: 'full',
        title:'Topics',
        canActivate:[AuthGuard]
      },
      {
        path: 'coordinators',
        component: CoordinatorlistComponent,
        pathMatch: 'full',
        title:'Coordinators',
        canActivate:[AuthGuard]
      },
      {
        path: 'newcoordinator',
        component: CoordinatordetailComponent,
        pathMatch: 'full',
        title:'New Coordinator',
        canActivate:[AuthGuard]
      },
      {
        path: 'organisingpartners',
        component: OrganisingPartnersComponent,
        pathMatch: 'full',
        title:'OrganisingPartners',
        canActivate:[AuthGuard]
      },

      {
        path: 'programme',
        component: ProgrammeListComponent,
        pathMatch: 'full',
        title:'Programmes',
        canActivate:[AuthGuard]
      },
      {
        path: 'adminprogramme',
        component: AdminProgrammListComponent,
        pathMatch: 'full',
        title:'Programmes',
        canActivate:[AuthGuard]
      },
      {
        path: 'qcapproval',
        component: QcapprovallistComponent,
        pathMatch: 'full',
        title:'QC Approval',
       canActivate:[AuthGuard]
      },
      {
        path: 'viewreport',
        component: ViewreportComponent,
        pathMatch: 'full',
        title:'View Report',
       canActivate:[AuthGuard]
      },
      {
        path: 'summaryreport',
        component: SummaryreportComponent,
        pathMatch: 'full',
        title:'Summary Report',
       canActivate:[AuthGuard]
      },
      {
        path: 'mtatcttrainer',
        component: TrainerlistComponent,
        pathMatch: 'full',
        title:'MTCTAT',
       canActivate:[AuthGuard]
      },
      {
        path: 'certificates',
        component: CertificateslistComponent,
        pathMatch: 'full',
        title:'Certificates',
       canActivate:[AuthGuard]
      },
      {
        path: 'zedfaculty',
        component: ZedfacultyComponent,
        pathMatch: 'full',
        title:'Faculty',
       canActivate:[AuthGuard]
      },
      {
        path: 'addfaculty',
        component: NewfacultyComponent,
        pathMatch: 'full',
        title:'New Faculty',
       canActivate:[AuthGuard]
      },
      {
        path: 'facultydetail/:id',
        component: FacultydetailComponent,
        pathMatch: 'full',
        title:'Faculty Detail',
       canActivate:[AuthGuard]
      },
      {
        path: 'allocatefaculty/:id',
        component: FacultyallotmentComponent,
        pathMatch: 'full',
        title:'Allot Faculty',
       canActivate:[AuthGuard]
      },
      {
        path:'changepassword',
        component:ChangepasswordComponent,
        pathMatch: 'full',
        title:'Password Reset',
        canActivate:[AuthGuard]
      },
      {
        path: 'newprogramme',
        component: NewprogrammeComponent,
        pathMatch: 'full',
        title:'New Programmes',
        canActivate:[AuthGuard]
      },
      {
        path: 'programmedetail',
        component: ProgrammeDetailComponent,
        pathMatch: 'full',
        title:'Programme Detail',
        canActivate:[AuthGuard]
      },
      {
        path: 'bvenue',
        component: BatchVenueComponent,
        pathMatch: 'full',
        title:'Programme Venue',
        canActivate:[AuthGuard]
      },
            {
        path: 'bparti',
        component: BatchParticipantsComponent,
        pathMatch: 'full',
        title:'Programme Participants',
        canActivate:[AuthGuard]
      },
      {
        path: 'uploadbatches',
        component: UploadParticipantsBatchesComponent,
        pathMatch: 'full',
        title: 'Upload Participants',
        canActivate: [AuthGuard]
      },
      {
        path: 'uploadparticipants/:id',
        component: UploadParticipantsComponent,
        pathMatch: 'full',
        title: 'Upload Participants',
        canActivate: [AuthGuard]
      },
      {
        path: 'ecommerce',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'Training Dashboard',
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'Calendar'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Profile'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'Form Elements'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'Basic Tables'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'Blank'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'Invoice'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'Line Chart'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'Bar Chart'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'Alerts'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'Avatars'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'Badges'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'Buttons'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'Images'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'Videos'
      },
      {
        path:'model',
        component:FullScreenModalComponent,
        title:'Modal'
      },
    ]
  },
  // participant layout
  {
    path: '',
    component: ParticipantLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'participantdashboard',
        component: ParticipantDashboardComponent,
        pathMatch: 'full',
        title: 'My Training',
        canActivate: [AuthGuard]
      },
    ]
  },

  // auth pages

  {
    path:'signin',
    component:SignInComponent,
    title:'Sign In'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'Sign Up'
  },
  {
    path:'participant/signin',
    component:ParticipantSignInComponent,
    title:'Participant Sign In'
  },
  {
    path:'participant/signup',
    component:ParticipantSignUpComponent,
    title:'Participant Register'
  },
  {
    path:'register',
    component:MasterRegisterComponent,
    title:'Register'
  },
  {
    path:'registerdetail/:id',
    component:RegisterDetailComponent,
    title:'Register'
  },
  {
    path:'trainingprogramme',
    component:TrainingprogrammesComponent,
    title:'Training'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Not Found'
  },
];

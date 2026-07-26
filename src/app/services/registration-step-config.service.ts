import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class RegistrationStepConfigService {

  constructor(private api: ApiService) {}

  getStepsForParticipant(category: string | null, subcategory: string | null): Observable<any[]> {
    return this.api.getSimple(`${APPURLs.registrationSteps}?category=${category ?? ''}&subcategory=${subcategory ?? ''}`);
  }

  getStepsForAdmin(category: string | null, subcategory: string | null): Observable<any[]> {
    return this.api.getSimple(`${APPURLs.registrationStepsAdmin}?category=${category ?? ''}&subcategory=${subcategory ?? ''}`);
  }

  toggleStep(stepKey: string, categoryValue: string, subCategoryValue: string, isEnabled: boolean): Observable<any> {
    return this.api.putSimple(APPURLs.registrationStepsToggle, { stepKey, categoryValue, subCategoryValue, isEnabled });
  }
}

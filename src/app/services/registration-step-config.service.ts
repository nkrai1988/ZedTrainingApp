import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { APPURLs } from '../shared/constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class RegistrationStepConfigService {

  constructor(private api: ApiService) {}

  getStepsForParticipant(category: string, subcategory: string): Observable<any[]> {
    return this.api.getSimple(`${APPURLs.registrationSteps}?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
  }

  getStepsForAdmin(category: string, subcategory: string): Observable<any[]> {
    return this.api.getSimple(`${APPURLs.registrationStepsAdmin}?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
  }

  toggleStep(stepKey: string, categoryValue: string, subCategoryValue: string, isEnabled: boolean): Observable<any> {
    return this.api.putSimple(APPURLs.registrationStepsToggle, { stepKey, categoryValue, subCategoryValue, isEnabled });
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { ParticipantService } from '../services/participant.service';

@Injectable({ providedIn: 'root' })
export class ParticipantApplicationGuard implements CanActivate {

  constructor(private participantService: ParticipantService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.participantService.getApplicationStatus().pipe(
      map(status => {
        const ps = status.participantStatus;
        if (!ps || ps === 'Registered') {
          return this.router.parseUrl('/participant/myapplication?reason=incomplete');
        }
        if (ps === 'Rejected') {
          return this.router.parseUrl('/participant/myapplication?reason=rejected');
        }
        return true;
      }),
      catchError(() => of(true))
    );
  }
}

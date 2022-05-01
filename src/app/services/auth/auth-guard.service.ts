import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth: AuthService, private router: Router) { }
  canActivate() {
    if (this.auth.IsLoggedIn()) {
      return true;
    }
    this.router.navigate(['/access-to-nft']);
    return false;
  }
}

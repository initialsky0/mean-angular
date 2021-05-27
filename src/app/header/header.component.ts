import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) { }

  private authListenerSub: Subscription;
  authState = false;

  ngOnInit() {
    this.authState = this.authService.userAuthState;
    this.authListenerSub = this.authService.getAuthStateListener()
    .subscribe(isAuth => {
      this.authState = isAuth;
    });
  }

  ngOnDestroy() {
    if(this.authListenerSub?.unsubscribe) this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
  }
}

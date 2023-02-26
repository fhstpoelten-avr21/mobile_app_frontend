import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import {Preferences} from '@capacitor/preferences';
import { Plugins, Capacitor } from '@capacitor/core';

import { AuthService } from './auth/auth.service';
import {take} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {AppState} from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  private authSub: Subscription;
  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   if (Capacitor.isPluginAvailable('SplashScreen')) {
    //     Plugins['SplashScreen']['hide']();
    //   }
    // });
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
    Plugins['App']['addListener'](
      'appStateChange',
      this.checkAuthOnResume.bind(this)
    );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    // Plugins.App.removeListener('appStateChange', this.checkAuthOnResume);
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }
}

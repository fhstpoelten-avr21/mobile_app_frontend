import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(name: string, email: string, password: string, confirm: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObserver: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObserver = this.authService.login(email, password);
        } else {
          authObserver = this.authService.signup(name, email, password, confirm);
        }
        authObserver.subscribe(
          response => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          },
          errRes => {
            loadingEl.dismiss();
            console.log('error', errRes)
            let message = 'Could not sign you up, please try again.';
            if(errRes.error) {
              if (errRes.error.message) {
                if (Array.isArray(errRes.error.message)) {
                  message = errRes.error.message[0]
                } else {
                  message = errRes.error.message
                }
              }
            }
            this.showAlert(message);
          }
        );
        this.isLoading = false
      });
  }


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const name = form.value.username;
    const email = form.value.email;
    const password = form.value.password;
    const confirm = form.value.confirm;

    this.authenticate(name, email, password,confirm);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}

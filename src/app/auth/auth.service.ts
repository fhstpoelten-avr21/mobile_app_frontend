import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Preferences} from '@capacitor/preferences';

import {User} from './user.model';


export interface AuthResponseData {
  id: string;
  email: string;
  token: string;
  tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User|null>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) {}

  get userIsAuthenticated() {
    console.log('check authentication')
    let result = this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );

    console.log('userIsAuthenticated', result)
    return result
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  autoLogin() {
    console.log('autoLogin 1')
    let result = from(Preferences.get({key: 'authData'})).pipe(
      map(storedData => {
        // @ts-ignore
        if (!storedData || !storedData.value) {
          return null;
        }
        // @ts-ignore
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );

    console.log('autoLogin 2', result)
    return result;
  }

  signup(name: string, email: string, password: string, confirm: string) {

    return this.http.post<AuthResponseData>(
      'http://localhost:3000/auth/signup',
      {name: name, email: email, password: password, confirm: confirm}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    let result = this.http
      .post<AuthResponseData>(
        'http://localhost:3000/auth/login',
        {username: email, password: password}
      )
      .pipe(tap(this.setUserData.bind(this)));

    console.log('loginResult', result)
    return result
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Preferences.remove({key: 'authData'})
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  private autoLogout(duration: number) {
    console.log('autoLogin')
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(Date.parse(userData.tokenExpirationDate))
    console.log('nest response', userData)

    const user = new User(
      userData.id,
      userData.email,
      userData.token,
      expirationTime
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.id,
      userData.token,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Preferences.set({
      key: 'authData',
      value: data
    }).then(r => console.log('stored authData', data));
  }
}

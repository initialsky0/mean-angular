import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
   constructor(private http: HttpClient, private router: Router) { }

   private authStateListener = new Subject<boolean>();
   private authDurTimer: number;
   private _token: string;
   private _userAuthState = false;

   get token() {
      return this._token;
   }

   get userAuthState() {
      return this._userAuthState;
   }

   getAuthStateListener() {
      return this.authStateListener.asObservable();
   }

   createUser(email: string, password: string) {
      const authData: AuthData = { email, password };
      this.http.post("http://localhost:3000/api/auth/signup", authData)
      .subscribe(resp => {
         console.log(resp);
      });
   }

   private saveAuthData(token: string, expirationDate: Date) {
      localStorage.setItem("token", token);
      localStorage.setItem("expiration", expirationDate.toISOString());
   }

   private clearAuthData() {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
   }

   private getAuthData() {
      const token = localStorage.getItem("token");
      const expiration = localStorage.getItem("expiration");
      if(!token || !expiration) return;
      const expirationDate = new Date(expiration);
      return { token, expirationDate };
   }

   private setAuthTimer(expirationDur: number) {
      this.authDurTimer = window.setTimeout(() => {
         this.logoutUser();
      }, expirationDur * 1000);
   }

   autoAuthUser() {
      const authData = this.getAuthData();
      if(!authData) return;
      const now = new Date();
      const expiresIn = authData.expirationDate.getTime() - now.getTime();
      if(expiresIn > 0) {
         this._token = authData.token;
         this._userAuthState = true;
         this.setAuthTimer(expiresIn / 1000);
         this.authStateListener.next(true);
      }
   }

   loginUser(email: string, password: string) {
      const authData: AuthData = { email, password };
      this.http.post<{ token: string, expiresIn: number }>("http://localhost:3000/api/auth/login", authData)
      .subscribe(response => {
         this._token = response.token;
         if(this._token) {
            const expirationDur = response.expiresIn;
            this.setAuthTimer(expirationDur);
            this._userAuthState = true;
            this.authStateListener.next(true);
            // calculate expiration
            const now = new Date();
            const expirationTime = new Date(now.getTime() + (expirationDur * 1000));
            this.saveAuthData(this._token, expirationTime);
            this.router.navigate(['/']);
         }
      });
   }

   logoutUser() {
      this._token = null;
      this._userAuthState = false;
      this.authStateListener.next(false);
      clearTimeout(this.authDurTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
   }
}
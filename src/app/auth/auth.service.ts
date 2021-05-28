import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { environment } from "../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/auth`


@Injectable({ providedIn: 'root' })
export class AuthService {
   constructor(private http: HttpClient, private router: Router) { }

   private authStateListener = new Subject<boolean>();
   private authDurTimer: number;
   private _token: string;
   private _userId: string;
   private _userAuthState = false;

   get token() {
      return this._token;
   }

   get userId() {
      return this._userId;
   }

   get userAuthState() {
      return this._userAuthState;
   }

   getAuthStateListener() {
      return this.authStateListener.asObservable();
   }

   createUser(email: string, password: string) {
      const authData: AuthData = { email, password };
      this.http.post(`${BACKEND_URL}/signup`, authData)
      .subscribe(resp => {
         this.router.navigate(['auth/login']);
      }, () => {
         this.authStateListener.next(false);
      });
   }

   private saveAuthData(token: string, expirationDate: Date, userId: string) {
      localStorage.setItem("token", token);
      localStorage.setItem("expiration", expirationDate.toISOString());
      localStorage.setItem("userId", userId);
   }

   private clearAuthData() {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("userId");
   }

   private getAuthData() {
      const token = localStorage.getItem("token");
      const expiration = localStorage.getItem("expiration");
      const userId = localStorage.getItem("userId");
      if(!token || !expiration || !userId) return;
      const expirationDate = new Date(expiration);
      return { token, expirationDate, userId };
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
         this._userId = authData.userId;
         this._userAuthState = true;
         this.setAuthTimer(expiresIn / 1000);
         this.authStateListener.next(true);
      }
   }

   loginUser(email: string, password: string) {
      const authData: AuthData = { email, password };
      this.http
      .post<{ 
         token: string, 
         userId: string, 
         expiresIn: number 
      }>(`${BACKEND_URL}/login`, authData)
      .subscribe(response => {
         this._token = response.token;
         if(this._token) {
            const expirationDur = response.expiresIn;
            this.setAuthTimer(expirationDur);
            this._userId = response.userId;
            this._userAuthState = true;
            this.authStateListener.next(true);
            // calculate expiration
            const now = new Date();
            const expirationTime = new Date(now.getTime() + (expirationDur * 1000));
            this.saveAuthData(response.token, expirationTime, response.userId);
            this.router.navigate(['/']);
         }
      }, () => {
         this.authStateListener.next(false);
      });
   }

   logoutUser() {
      this._token = null;
      this._userId = null;
      this._userAuthState = false;
      this.authStateListener.next(false);
      clearTimeout(this.authDurTimer);
      this.clearAuthData();
      this.router.navigate(['/']);
   }
}
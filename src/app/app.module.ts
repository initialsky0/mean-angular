import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './modules/app-routing.module';

import { AngularMaterialModule } from './modules/angular-material.module';
import { PostsModule } from './modules/posts.module';
// AuthModule is lazy loaded, so not included in here

import { AppComponent } from './app.component';

// Custom components
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';

// Interceptor
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  declarations: [
    AppComponent, 
    HeaderComponent, 
    ErrorComponent
  ],
  imports: [
    BrowserModule, 
    HttpClientModule,
    BrowserAnimationsModule, 
    AppRoutingModule, 
    AngularMaterialModule, 
    PostsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent], 
  // entryComponents is no longer necessary
  // entryComponents: [ErrorComponent]
})
export class AppModule { }

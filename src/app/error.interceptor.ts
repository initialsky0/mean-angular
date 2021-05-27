import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
   constructor(private dialog: MatDialog) { }

   getErrorMessage(error): string {
      if(error?.error) {
         return this.getErrorMessage(error.error);
      } else if(error?.message) {
         return error.message;
      } else {
         return "An unknown error occurred.";
      }
   }

   intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
         catchError((error: HttpErrorResponse) => {
            const message = this.getErrorMessage(error);
            this.dialog.open(ErrorComponent, { data: { message } });
            return throwError(error);
         })
      );
   }
}
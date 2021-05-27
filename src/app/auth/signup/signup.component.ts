import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
   templateUrl: "./signup.component.html", 
   styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
   constructor(private authService: AuthService) { }

   private authStateSub: Subscription;
   isLoading= false;

   ngOnInit() {
      this.authStateSub = this.authService.getAuthStateListener().subscribe(
         authStatus => {
            if(!authStatus) this.isLoading = authStatus;
      });
   }

   ngOnDestroy() {
      if(this.authStateSub?.unsubscribe) this.authStateSub.unsubscribe();
   }

   onSubmit(form: NgForm) {
      if(form.invalid) return;
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
      form.resetForm();
   }
};
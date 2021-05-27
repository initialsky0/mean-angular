import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
   templateUrl: "./login.component.html", 
   styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
   constructor(private authService: AuthService) { }

   private authStateSub: Subscription;
   isLoading= false;
   
   ngOnInit() {
      this.authStateSub = this.authService.getAuthStateListener().subscribe(
         () => {
            this.isLoading = false;
      });
   }

   ngOnDestroy() {
      if(this.authStateSub?.unsubscribe) this.authStateSub.unsubscribe();
   }
   onSubmit(form: NgForm) {
      if(form.invalid) return;
      this.isLoading = true;
      this.authService.loginUser(form.value.email, form.value.password);
      form.resetForm();
   }
};
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
   templateUrl: "./signup.component.html", 
   styleUrls: ["./signup.component.scss"]
})
export class SignupComponent {
   constructor(private authService: AuthService) { }

   isLoading= false;

   onSubmit(form: NgForm) {
      if(form.invalid) return;
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
      form.resetForm();
   }
};
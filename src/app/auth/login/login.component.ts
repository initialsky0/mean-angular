import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
   templateUrl: "./login.component.html", 
   styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
   constructor(private authService: AuthService) { }

   isLoading= false;

   onSubmit(form: NgForm) {
      if(form.invalid) return;
      this.isLoading = true;
      this.authService.loginUser(form.value.email, form.value.password);
      form.resetForm();
   }
};
import { Component } from '@angular/core';
import { AuthService, IUserCreate } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,private router:Router) { }

  async onSubmit() {
    const { username, email, password } = this.form;
    const param : IUserCreate = {
      userName: username,
      userPassword: password,
      email: email,
      roleName: "user"
    }
    const result = await this.authService.createUser(param);
    console.log(result)
    if (result.status === "200"){
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']);

    }else{
        this.errorMessage = "err.error.message";
        this.isSignUpFailed = true;
    }
  }
  }


import { Component, OnInit } from '@angular/core';
import { AuthService, IUserLoginRequest } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private storageService: StorageService,private router: Router) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

 async onSubmit() {
    const { username, password } = this.form;
    const payload : IUserLoginRequest = {
      userName: username,
      passWord: password
    }
    const result = await this.authService.authenticate(payload);
    if (result.status !== '200') {
      this.isLoginFailed = true;
    }else {
      localStorage.setItem('auth_token', result.data.access_token);
      localStorage.setItem('refresh_token', result.data.refresh_token);
      localStorage.setItem('user_role', result.data.user_role);
      this.storageService.saveUser(result.data);
      this.roles = result.data.user_role;
      
      this.isLoggedIn = true;
      this.isLoginFailed = false;
      this.router.navigate(['/project']);
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
}

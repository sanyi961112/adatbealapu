import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {RestService} from "../../services/rest.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message: any;
  loginForm = new FormGroup({
    username: new FormControl( [Validators.minLength(3)]),
    password: new FormControl([Validators.minLength(3)])
  });
  registerForm = new FormGroup({
    email: new FormControl(),
    fullname: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    password2: new FormControl(),
  });

  constructor(private rest: RestService, private router: Router, private toastr: ToastrService) {
    this.loginForm.controls['username'].setValue('');
    this.loginForm.controls['password'].setValue('');
    if (localStorage.getItem('isLoggedIn') === null){
      localStorage.setItem('isLoggedIn', 'false');
    }
    if (localStorage.getItem('currentUser') === null){
      localStorage.setItem('currentUser', '');
    }
  }

  ngOnInit(): void {

  }

  async loginUser(): Promise<any> {
    try {
      const loginUser = this.loginForm.controls['username'].value;
      const loginPass = this.loginForm.controls['password'].value;
      const currentLogin = {
        username: loginUser,
        password: loginPass
      }
      if (this.loginForm.invalid){
        this.toastr.info("the form is invalid, please check it", "Notice")
        return;
      }
      if (loginUser === '' || loginPass === ''){
        this.toastr.info("Make sure to fill out the username and password fields", "Notice")
        return;
      }
      this.message = await this.rest.loginUser(currentLogin);
      if(this.message['message'] === 'user authenticated'){
        localStorage.setItem('isLoggedIn', JSON.parse('true'));
        localStorage.setItem('currentUser', loginUser);
        await this.router.navigate([`/main`]);
      } else {
        this.toastr.error('Bad username/password combo, make sure to register first', 'Error');
        return;
      }
    } catch (e){
      console.log(e);
    }
  }

  async registerUser(): Promise<any> {
    try {
      if (this.registerForm.invalid){
        return;
      }
      const regUser = this.registerForm.controls['username'].value;
      const regPass = this.registerForm.controls['password'].value;
      const regPass2 = this.registerForm.controls['password2'].value;
      const regFull = this.registerForm.controls['fullname'].value;
      const regEmail = this.registerForm.controls['email'].value;
      if(regPass !== regPass2){
        this.toastr.info('Passwords do not match!', 'Notice');
        return;
      }
      const newUser = {
        username: regUser,
        password: regPass,
        full_name: regFull,
        email: regEmail,
        location: "",
      }
      this.message = await this.rest.registerUser(newUser);
      // console.log(this.message);
      if(this.message['message'] === 'user taken'){
        this.toastr.info('This Username is already taken, choose another one!', 'Notice');
        return;
      }
      this.registerForm.reset();
      this.toastr.success('You are now registered, try to log in!', 'Success');
    } catch (e){
      console.log(e);
    }
  }
}

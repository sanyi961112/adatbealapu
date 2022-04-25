import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });
  registerForm = new FormGroup({
    email: new FormControl(),
    fullname: new FormControl(),
    username: new FormControl(),
    password: new FormControl(),
    password2: new FormControl(),
  });

  constructor() { }

  ngOnInit(): void {
  }

  loginUser(): void {
    try {
      if (this.loginForm.invalid){
        return;
      }
      const loginUser = this.loginForm.controls['username'].value;
      const loginPass = this.loginForm.controls['password'].value;

    } catch (e){
      console.log(e);
    }
  }

  registerUser(): void{
    try {
      if (this.loginForm.invalid){
        return;
      }
      const regUsername = this.registerForm.controls['username'].value;
      const regPassword = this.registerForm.controls['password'].value;
      const regFullname = this.registerForm.controls['fullname'].value;
      const regEmail = this.registerForm.controls['email'].value;

    } catch (e){
      console.log(e);
    }
  }
}

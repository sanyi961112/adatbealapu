import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {RestService} from "../../services/rest.service";

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

  constructor(private rest: RestService) { }

  ngOnInit(): void {
  }

  loginUser(): void {
    try {
      if (this.loginForm.invalid){
        return;
      }
      const loginUser = this.loginForm.controls['username'].value;
      const loginPass = this.loginForm.controls['password'].value;
      const currentLogin = {
        username: loginUser,
        password: loginPass
      }
      this.rest.loginUser(currentLogin);
    } catch (e){
      console.log(e);
    }
  }

  registerUser(): void{
    try {
      if (this.loginForm.invalid){
        return;
      }
      const regUser = this.registerForm.controls['username'].value;
      const regPass = this.registerForm.controls['password'].value;
      const regPass2 = this.registerForm.controls['password2'].value;
      const regFull = this.registerForm.controls['fullname'].value;
      const regEmail = this.registerForm.controls['email'].value;
      if(regPass !== regPass2){
        return;
      }
      const newUser = {
        username: regUser,
        password: regPass,
        full_name: regFull,
        email: regEmail,
        location: "",
      }

      this.rest.registerUser(newUser);
    } catch (e){
      console.log(e);
    }
  }
}

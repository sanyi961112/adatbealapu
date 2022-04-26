import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../services/rest.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isLoginUserProfile: boolean = false;
  currentUser: string = '';
  currentProfile = {};
  updateForm = new FormGroup({
    username: new FormControl([]),
    full_name: new FormControl([]),
    oldpass: new FormControl([]),
    password: new FormControl([]),
    password2: new FormControl([]),
    location: new FormControl([])
    });
  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"','');
    this.currentUser = this.currentUser.replace('"','');
    if (window.location.href.includes(this.currentUser)){
      this.isLoginUserProfile = true;
    }
    this.getUserProfile();
  }

  getUserProfile() {
    this.rest.getProfile(this.currentUser);
  }

  updateMyProfile(){
    // this.rest.updateUser();
  }
  deleteMyProfile(){
    // this.rest.deleteUser();
  }
}

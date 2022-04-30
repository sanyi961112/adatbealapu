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
  currentUser: string = '';
  isLoggedIn: any;
  isLoginUserProfile: boolean = false;
  photoList: any;
  currentProfile: any;
  currentUsername: string = '';
  currentFull: string = '';
  currentMail: string = '';
  currentLocation: string = '';
  updateForm = new FormGroup({
    username: new FormControl([]),
    full_name: new FormControl([]),
    oldpass: new FormControl([]),
    password: new FormControl([]),
    password2: new FormControl([]),
    location: new FormControl([])
    });
  user: any;
  link: any;

  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.updateForm.reset();

    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"','');
    this.currentUser = this.currentUser.replace('"','');
    this.isLoggedIn = (localStorage.getItem('isLoggedIn'));
    this.link = window.location.href;
    this.user = this.link.split("/", 5);
    this.user = this.user[4];

    if(this.isLoggedIn === 'true'){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    if (this.isLoggedIn && this.user === this.currentUser) {
      this.isLoginUserProfile = true;
    }
    if (this.user === this.currentUser){
      this.isLoginUserProfile = true;
    }

    if (this.isLoginUserProfile){
      this.user = this.currentUser;
      this.getUserProfile();
    } else {
      this.isLoginUserProfile = false;
      this.getUserProfile();
    }
  }

  async getUserProfile() {
   this.rest.getProfile(this.user).subscribe(res => {
     this.currentProfile = res;
     console.log(JSON.stringify(this.currentProfile));
     this.currentUsername = this.currentProfile[0]['USERNAME'];
     this.currentFull = this.currentProfile[0]['FULL_NAME'];
     this.currentMail = this.currentProfile[0]['EMAIL'];
     this.currentLocation = this.currentProfile[0]['LOCATION'];
   });
   await this.rest.getPhotos(this.currentUsername).subscribe(res => {
     this.photoList = res;
   })
  }

  updateMyProfile(){
    // this.rest.updateUser();
  }
  deleteMyProfile(){
    // this.rest.deleteUser();
  }
}

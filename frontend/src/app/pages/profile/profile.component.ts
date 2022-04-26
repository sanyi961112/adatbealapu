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
   this.rest.getProfile(this.currentUser).subscribe(response => {
     this.currentProfile = response;
     console.log(JSON.stringify(this.currentProfile));
     this.currentUsername = this.currentProfile[0]['USERNAME'];
     this.currentFull = this.currentProfile[0]['FULL_NAME'];
     this.currentMail = this.currentProfile[0]['EMAIL'];
     this.currentLocation = this.currentProfile[0]['LOCATION'];
   });
  }

  updateMyProfile(){
    // this.rest.updateUser();
  }
  deleteMyProfile(){
    // this.rest.deleteUser();
  }
}

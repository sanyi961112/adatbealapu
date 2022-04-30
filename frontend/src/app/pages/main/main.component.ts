import { Component, OnInit } from '@angular/core';
import {RestService} from "../../services/rest.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  photos: any;
  currentUser: any;
  isLoggedIn: any;
  link: any;
  user: any;
  isLoginUserPhotos: any;
  constructor(private rest: RestService, private router: Router, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"', '');
    this.currentUser = this.currentUser.replace('"', '');
    this.isLoggedIn = (localStorage.getItem('isLoggedIn'));
    this.user = this.currentUser

    if(this.isLoggedIn === 'true'){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    if (this.isLoggedIn) {
      this.isLoginUserPhotos = true;
    }

    if (this.isLoginUserPhotos) {
      this.isLoginUserPhotos = true;
      this.getLatestPhotos();
    }
  }

  async getLatestPhotos() {
    this.rest.getLatestPhotos(this.user).subscribe(res => {
      this.photos = res;
    });
  }

  toMyPhotos() {
      this.router.navigate(['/photos', this.currentUser]).then();
  }
}

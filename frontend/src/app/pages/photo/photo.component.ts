import { Component, OnInit } from '@angular/core';
import {RestService} from "../../services/rest.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {
  photoId: string = '';
  currentUser: string = '';
  isLoggedIn: any;
  isLoginUserPhoto: boolean = false;
  link: any;
  user: any;
  photo: any;
  ratingForm = new FormGroup({
    rating: new FormControl({})
  });
  values: any;

  constructor(private rest: RestService, private toastr: ToastrService,private router: Router) {
    this.values = [1,2,3,4,5];
  }

  ngOnInit(): void {
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"', '');
    this.currentUser = this.currentUser.replace('"', '');
    this.isLoggedIn = (localStorage.getItem('isLoggedIn'));
    this.link = window.location.href;
    this.link = this.link.split("/", 5);
    this.photoId = this.link[4];

    if(this.isLoggedIn === 'true'){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    if (this.isLoggedIn && this.user === this.currentUser) {
      this.isLoginUserPhoto = true;
    }
    if (this.user === this.currentUser){
      this.isLoginUserPhoto = true;
    }

    this.getPhoto(this.photoId);
  }

  async getPhoto(photoId: string){
    await this.rest.getPhoto(photoId).subscribe(res => {
      this.photo = res;
      console.log(this.photo[0]);
      if(this.photo[0] === undefined){
        this.router.navigate(['/main']);
      }
    });
  }

  async saveRating() {
    console.log('hello');
    console.log(this.ratingForm.controls['rating'].value);
    // Ratings table getter
    // await this.getRatings();

    // Ratings table
    // await this.rest.addRating();

    // this will operate on the photo table
    // await this.rest.setCurrentRating();

    //toastr success: photo rated
    //then we need to await getPhoto again with the new rating
  }

  async getRatings() {

  }

  calculateNewRating(){

  }
}

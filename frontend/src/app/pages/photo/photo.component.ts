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
  ratingForm = new FormGroup({
    rating: new FormControl({})
  });

  isRating: boolean = false;
  photoId: string = '';
  currentUser: string = '';
  isLoggedIn: any;
  isLoginUserPhoto: boolean = false;
  link: any;
  user: any;
  photo: any;
  gotRating: any;
  gotRatings: any;
  values: any;
  existingRatingId: string = '';
  currentRating: any;

  constructor(private rest: RestService, private toastr: ToastrService,private router: Router) {
    this.values = [1,2,3,4,5];
  }

  ngOnInit(): void {
    this.ratingForm.reset();
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
    this.getStuff();
  }

  async getStuff(){
    await this.getPhoto(this.photoId);
    await this.getRating();
  }

  async getPhoto(photoId: string){
    await this.rest.getPhoto(photoId).subscribe(res => {
      this.photo = res;
      if(this.photo[0] === undefined){
        this.router.navigate(['/main']);
      }
    });
  }

  /*main function to save new rating or update existing rating + update photo current ratings for view and db*/
  async saveRating() {
    try{
      const rating = this.ratingForm.controls['rating'].value;
      if(rating === '' || rating === 'none' || rating === null){
        this.toastr.info('Please select rating value from 1 to 5', 'Notice');
        return;
      }
      // check if this user already rated this photo
      await this.getRating();
      if(this.gotRating === undefined || this.gotRating[0] === undefined){
        await this.addRating();
        this.toastr.success('Your rating has been published', 'Success');
      } else {
        await this.updateRating();
        this.toastr.success('Your rating has been updated', 'Success');
      }
      await this.getRating();
      await this.getRatings();
      return;
    } catch (e){
      this.toastr.info('' + e, 'Error');
      return;
    }
  }

  async getRating() {
    const photoData = {
      id_photo: this.photoId,
      voter: this.currentUser
    }
    await this.rest.getRating(photoData).subscribe(res => {
      this.gotRating = res;
      if(this.gotRating !== undefined){
        this.isRating = true;
        this.existingRatingId = this.gotRating[0][0];
      }
    });
  }

  async getRatings() {
    const photoId = {
      id_photo: this.photoId,
    }
    await this.rest.getRatings(photoId).subscribe(res => {
      this.gotRatings = res;
      this.currentRating = this.calculateNewRating();
      this.updatePhotoRating();
    });
  }

  async addRating(){
    const newRatingId = this.generateId();
    const rating = {
      id_rating: newRatingId,
      id_photo: this.photoId,
      rating: this.ratingForm.controls['rating'].value,
      voter: this.currentUser,
    }
    await this.rest.addRating(rating);
  }

  async updateRating(){
    const newRating = {
      id_rating: this.existingRatingId,
      id_photo: this.photoId,
      rating: this.ratingForm.controls['rating'].value,
      voter: this.currentUser
    }
    await this.rest.updateRating(newRating);
  }

  calculateNewRating(): number{
    let sum = 0;
    if(this.gotRatings.length === 0 || this.gotRatings === undefined){
      return 0;
    }
    for(let i = 0; i < this.gotRatings.length; i++){
      sum = sum + this.gotRatings[i][2];
    }
    const len = this.gotRatings.length;
    const value = sum/len;
    return value;
  }

  async updatePhotoRating() {
    const rating = {
      id_photo: this.photoId,
      rating: this.currentRating
    }
    await this.rest.updatePhotoRating(rating);
  }

  generateId(): string{
    return Math.random().toString(16).slice(2);
  }
}

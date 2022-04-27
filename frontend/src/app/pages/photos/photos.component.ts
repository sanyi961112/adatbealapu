import {Component, OnInit} from '@angular/core';
import {RestService} from "../../services/rest.service";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  currentUser: string = '';
  isLoginUserPhotos: boolean = false;
  newId: string = '';
  photos: any;
  categories: any;
  cities: any;
  newPhotoForm = new FormGroup({
    title: new FormControl([Validators.required,Validators.minLength(3)]),
    description: new FormControl([Validators.minLength(3)]),
    image: new FormControl([Validators.required]),
    category: new FormControl(),
    location: new FormControl([Validators.minLength(3)]),
  });
  newCityForm = new FormGroup({
    name: new FormControl([Validators.minLength(3)]),
    country: new FormControl([Validators.minLength(3)]),
  });
  user: any;
  link: any;
  imageFile: string | ArrayBuffer | null = '';

  constructor(private rest: RestService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.newPhotoForm.reset();
    this.newCityForm.reset();
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"', '');
    this.currentUser = this.currentUser.replace('"', '');
    if (window.location.href.includes(this.currentUser)) {
      this.isLoginUserPhotos = true;
      this.user = this.currentUser;
      this.getUserPhotos();
      this.getCategories();
      this.getCities();
    } else {
      this.isLoginUserPhotos = false;
      this.link = window.location.href;
      this.user = this.link.split("/", 5);
      this.user = this.user[4];
      this.getUserPhotos();
    }
  }

  addNewPhoto() {
    try {
      if (this.newPhotoForm.invalid) {
        this.toastr.info('please fill out all required fields', 'Notice');
        return;
      }
      if (this.newPhotoForm.controls['location'].value === null){
        this.newPhotoForm.controls['location'].setValue('');
      }
      if (this.imageFile === ''){
        this.toastr.info('Upload an image, please', 'Notice');
        return;
      }
      this.newId = this.generatePhotoId();
      const photo = {
        id_photo: this.newId,
        title: this.newPhotoForm.controls['title'].value,
        description: this.newPhotoForm.controls['description'].value,
        uploadDate: this.getDate(),
        owner: this.currentUser,
        image: this.imageFile,
        currentRating: 0,
        categories: this.newPhotoForm.controls['category'].value,
        location: this.newPhotoForm.controls['location'].value
      }
      console.log(photo);
      this.rest.savePhoto(photo);
      this.newPhotoForm.reset();
      this.toastr.success('Successfully uploaded photo', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  addNewCity() {
    try{

    } catch (e) {

    }
  }

  getDate(): string{
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const date = year + "-" + month + "-" + day;
    return date;
  }

  generatePhotoId(): string {
    return Math.random().toString(16).slice(2);
  }

  getUserPhotos() {
    this.rest.getPhotos(this.user).subscribe(res => {
      this.photos = res;
      console.log(JSON.stringify(this.photos));
    });
  }

  getCategories() {
    this.rest.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  getCities() {
    this.rest.getCities().subscribe(res => {
      this.cities = res;
    });
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageFile = reader.result;
    };
  }
}

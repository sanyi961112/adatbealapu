import {Component, OnInit} from '@angular/core';
import {RestService} from "../../services/rest.service";
import {ToastrService} from "ngx-toastr";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  newPhotoForm = new FormGroup({
    title: new FormControl([Validators.required, Validators.minLength(3)]),
    description: new FormControl([Validators.minLength(3)]),
    image: new FormControl([Validators.required]),
    category: new FormControl(),
    location: new FormControl([Validators.minLength(3)]),
  });
  newCityForm = new FormGroup({
    name: new FormControl([Validators.required, Validators.minLength(3)]),
    country: new FormControl([Validators.required, Validators.minLength(3)]),
  });
  newCategoryForm = new FormGroup({
    category: new FormControl([Validators.required, Validators.minLength(3)]),
  });

  isLoginUserPhotos: boolean = false;
  isLoggedIn: any;
  photoCategory: any;
  currentUser: string = '';
  newId: string = '';
  photos: any;
  categories: any;
  cities: any;
  user: any;
  link: any;
  imageFile: string | ArrayBuffer | null = '';
  newCityName: string = '';
  countryName: string = '';
  newCategory: string = '';
  photoCount: number = 0;

  constructor(private rest: RestService, private toastr: ToastrService,private router: Router) {
  }

  ngOnInit(): void {
    this.newPhotoForm.reset();
    this.newCityForm.reset();
    this.newCategoryForm.reset();

    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"', '');
    this.currentUser = this.currentUser.replace('"', '');
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
      this.isLoginUserPhotos = true;
    }
    if (this.user === this.currentUser){
      this.isLoginUserPhotos = true;
    }

    if (this.isLoginUserPhotos) {
      this.isLoginUserPhotos = true;
      this.getUserPhotos();
      this.getCategories();
      this.getCities();
    } else {
      this.getUserPhotos();
    }
  }

  async addNewPhoto() {
    try {
      this.photoCategory = this.newPhotoForm.controls['category'].value;
      if (this.imageFile === '') {
        this.toastr.info('Please upload an image first', 'Notice');
        return;
      }
      if (this.newPhotoForm.controls['category'].value === null || this.newPhotoForm.controls['location'].value === null) {
        this.toastr.info('please fill out all fields', 'Notice');
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
        categories: this.photoCategory,
        location: this.newPhotoForm.controls['location'].value
      }
      await this.rest.savePhoto(photo);
      await this.rest.getPhotos(this.user).subscribe(res => {
        this.photos = res;
        this.photoCount = this.photos.length;
      });
      this.newPhotoForm.reset();
      this.newPhotoForm.controls['category'].setValue('digital');
      this.imageFile = '';
      this.toastr.success('Successfully uploaded photo', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  async addNewCity() {
    try {
      this.newCityName = this.newCityForm.controls['name'].value;
      this.countryName = this.newCityForm.controls['country'].value;
      if (this.newCityForm.invalid || this.newCityName === null || this.countryName === null){
        this.toastr.info('please fill the form', 'Notice');
        return;
      }
      this.newId = this.generatePhotoId();
      const city = {
        id_city: this.newId,
        name: this.newCityForm.controls['name'].value,
        ascii_name: this.newCityForm.controls['name'].value,
        country_name: this.newCityForm.controls['country'].value,
      }
      console.log(city);
      await this.rest.addCity(city);
      await this.rest.getCities();
      this.newCityForm.reset();
      this.toastr.success('Successfully added a new city', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  async addNewCategory(){
    try {
      console.log('hello');
      this.newCategory = this.newCategoryForm.controls['category'].value;
      if (this.newCategoryForm.invalid || this.newCategory === null){
        this.toastr.info('please fill the field', 'Notice');
        return;
      }
      this.newId = this.generatePhotoId();
      const category = {
        category_name: this.newCategoryForm.controls['category'].value
      }
      await this.rest.addCategory(category);
      this.newCategoryForm.reset();
      await this.getCategories();
      this.toastr.success('Successfully added a new category', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  getDate(): Date {
    const dateObj = new Date();
    return dateObj;
  }

  generatePhotoId(): string {
    return Math.random().toString(16).slice(2);
  }

  async getUserPhotos() {
    this.rest.getPhotos(this.user).subscribe(res => {
      this.photos = res;
      this.photoCount = this.photos.length;
    });
  }

  async getCategories() {
    this.rest.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  async getCities() {
    this.rest.getCities().subscribe(res => {
      this.cities = res;
    });
  }

  async removePhoto(photoId: string) {
    try{
      const id = {
        idPhoto: photoId};
      await this.rest.removePhoto(id);
      this.toastr.success('Successfully deleted photo', 'Success');
      await this.getUserPhotos();
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageFile = reader.result;
    };
  }

  rateThisPhoto(photoId: string) {
    this.router.navigate(['/photo', photoId]).then();
  }
}

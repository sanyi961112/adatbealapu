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
  blob: any;
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
  user: any;
  link: any;
  imageFile: string | ArrayBuffer | null = '';
  newCityName: string = '';
  countryName: string = '';
  newCategory: string = '';


  constructor(private rest: RestService, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.newPhotoForm.reset();
    this.newCityForm.reset();
    this.newCategoryForm.reset();
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
      if (this.newPhotoForm.controls['location'].value === null) {
        this.newPhotoForm.controls['location'].setValue('');
      }
      if (this.imageFile === '') {
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
        image: this.blob,
        currentRating: 0,
        categories: this.newPhotoForm.controls['category'].value,
        location: this.newPhotoForm.controls['location'].value
      }
      //TODO somehow save image
      console.log(photo);
      this.rest.savePhoto(photo);
      this.newPhotoForm.reset();
      this.toastr.success('Successfully uploaded photo', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  addNewCity() {
    try {
      console.log('hello');
      this.newCityName = this.newCityForm.controls['name'].value;
      this.countryName = this.newCityForm.controls['country'].value;
      if (this.newCityForm.invalid || this.newCityName === null || this.countryName === null){
        this.toastr.info('please fill the form', 'Notice');
        return;
      }
      console.log('hello');
      this.newId = this.generatePhotoId();
      const city = {
        id_city: this.newId,
        name: this.newCityForm.controls['name'].value,
        ascii_name: this.newCityForm.controls['name'].value,
        country_name: this.newCityForm.controls['country'].value,
      }
      console.log(city);
      this.rest.addCity(city);
      this.rest.getCities();
      this.newCityForm.reset();
      this.toastr.success('Successfully added a new city', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  addNewCategory(){
    try {
      console.log('hello');
      this.newCategory = this.newCategoryForm.controls['category'].value;
      if (this.newCategoryForm.invalid || this.newCategory === null){
        this.toastr.info('please fill the field', 'Notice');
        return;
      }
      console.log('hello');
      this.newId = this.generatePhotoId();
      const category = {
        category_name: this.newCategoryForm.controls['category'].value
      }
      this.rest.addCategory(category);
      this.newCategoryForm.reset();
      this.toastr.success('Successfully added a new category', 'Success');
    } catch (e) {
      this.toastr.error('' + e, 'Error');
    }
  }

  getDate(): string {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const date = year + "/" + month + "/" + day;
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
      this.blob = this.dataURLtoBlob(reader.result);
    };
  }

  dataURLtoBlob(dataURL: any) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], {type: contentType});
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: contentType});
  }
}
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RestService {


  constructor(private http: HttpClient) {

  }

  async loginUser(currentLogin: any): Promise<any>{
    console.log('logging in user');
    const message = await this.http.post('http://localhost:3000/login', currentLogin).toPromise();
    return(message);
  }
  async registerUser(newUser: any): Promise<any>{
    console.log('registering a new user');
    const message = await this.http.post('http://localhost:3000/register', newUser).toPromise();
    return(message);
  }
  async savePhoto(photo: any){
    console.log('saving an image');
    const message = await this.http.post('http://localhost:3000/photo', photo).toPromise();
    return(message);
  }
  async addCity(city: any): Promise<any>{
    console.log('adding a new city');
    const message = await this.http.post('http://localhost:3000/city', city).toPromise();
    return(message);
  }
  getProfile(username: string): Observable<any>{
    console.log('get profile');
    const url = 'http://localhost:3000/profile/';
    let parameters = new HttpParams;
    parameters = parameters.append('username', username);
    return this.http.get<any>( url, {params: parameters});
  }
  getPhotos(owner: string): Observable<any>{
    console.log('get all owned photos of user');
    const url = 'http://localhost:3000/photos/';
    let parameters = new HttpParams;
    parameters = parameters.append('owner', owner);
    return this.http.get<any>( url, {params: parameters});
  }
  getCategories(): Observable<any>{
    console.log('get categories');
    const url = 'http://localhost:3000/categories/';
    return this.http.get<any>(url);
  }
  getCities(): Observable<any>{
    console.log('get cities');
    const url = 'http://localhost:3000/cities/';
    return this.http.get<any>(url);
  }


  /* get all the photos of the owner for profile
   */
  // async getPhotos(owner: string){
  //   await this.http.get('http://localhost:3000/photos?').subscribe({
  //     next: data => {
  //       console.log(data);
  //     },
  //     error: error => {
  //       console.error('There was an error!', error);
  //     }
  //   });
  //   console.log('getting all photos of this owner');
  // }



  // async saveNewPhoto(photo: any){
  //   console.log('add new photo of this owner');
  // }
  //
  // async saveNewAlbum(album: any){
  //   console.log('add new album of this owner');
  // }
  //
  // async addNewRating(rating: any){
  //   console.log('add new rating of this photo');
  // }
  //

  //
  // async getCities(cityName: string){
  //   console.log('');
  // }
  //
  // async addNewCity(city: any){
  //
  // }
  // async saveNewCategory(category: any){
  //   console.log('adding new category to list');
  //   await this.http.post('http://localhost:3000/category', category).toPromise();
  // }



}

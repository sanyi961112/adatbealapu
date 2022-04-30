import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  async registerUser(newUser: any): Promise<any>{
    console.log('registering a new user');
    const message = await this.http.post('http://localhost:3000/register', newUser).toPromise();
    return(message);
  }
  async loginUser(currentLogin: any): Promise<any>{
    console.log('logging in user');
    const message = await this.http.post('http://localhost:3000/login', currentLogin).toPromise();
    return(message);
  }
  async addCity(city: any): Promise<any>{
    console.log('adding a new city');
    const message = await this.http.post('http://localhost:3000/city', city).toPromise();
    return(message);
  }
  async addCategory(category: any): Promise<any>{
    console.log('adding a new category');
    const message = await this.http.post('http://localhost:3000/category', category).toPromise();
    return(message);
  }
  async savePhoto(photo: any){
    console.log('saving an image');
    const message = await this.http.post('http://localhost:3000/photo', photo).toPromise();
    return(message);
  }
  async removePhoto(photoId: any): Promise<any> {
    console.log('user deleting photo');
    const message = await this.http.post('http://localhost:3000/removePhoto', photoId).toPromise();
    return(message);
  }
  async removeAlbum(album: any): Promise<any>{
    console.log('removing an album');
    const message = await this.http.post('http://localhost:3000/removeAlbum', album).toPromise();
    return(message);
  }
  async addRating(rating: any): Promise<any> {
    console.log('adding a new rating');
    const message = await this.http.post('http://localhost:3000/addRating', rating).toPromise();
    return message;
  }
  async setCurrentRating() {

  }

  getSomeUsers(user: any): Observable<any> {
    console.log('searching some users');
    const url = 'http://localhost:3000/getSomeUsers';
    let parameters = new HttpParams;
    parameters = parameters.append('user', user);
    return this.http.get<any>( url, {params: parameters});
  }
  getPhotos(owner: string): Observable<any>{
    console.log('get all owned photos of user');
    const url = 'http://localhost:3000/photos/';
    let parameters = new HttpParams;
    parameters = parameters.append('owner', owner);
    return this.http.get<any>( url, {params: parameters});
  }
  getPhoto(photoId: string): Observable<any>{
    console.log('get a photo by id');
    const url = 'http://localhost:3000/photo/';
    let parameters = new HttpParams;
    parameters = parameters.append('photoId', photoId);
    return this.http.get<any>( url, {params: parameters});
  }
  getLatestPhotos(owner: string): Observable<any>{
    console.log('get 5 latest photos of user');
    const url = 'http://localhost:3000/latest';
    let parameters = new HttpParams;
    parameters = parameters.append('owner', owner);
    return this.http.get<any>( url, {params: parameters});
  }
  getProfile(username: string): Observable<any>{
    console.log('get profile');
    const url = 'http://localhost:3000/profile/';
    let parameters = new HttpParams;
    parameters = parameters.append('username', username);
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

}

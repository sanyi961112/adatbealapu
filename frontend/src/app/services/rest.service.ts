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

  getPhotos(owner: string): Observable<any>{
    console.log('get all owned photos of user');
    const url = 'http://localhost:3000/photos/';
    let parameters = new HttpParams;
    parameters = parameters.append('owner', owner);
    return this.http.get<any>( url, {params: parameters});
  }
  async savePhoto(photo: any){
    console.log('saving an image');
    const message = await this.http.post('http://localhost:3000/photo', photo).toPromise();
    return(message);
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
  async removePhoto(photoId: any): Promise<any> {
    console.log('user deleting photo');
    const message = await this.http.post('http://localhost:3000/removePhoto', photoId).toPromise();
    return(message);
  }
}

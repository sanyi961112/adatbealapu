import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class RestService {


  constructor(private http: HttpClient) {

  }

  async loginUser(currentLogin: any){
    console.log('logging in user');
    const message = await this.http.post('http://localhost:3000/login', currentLogin).toPromise();
    return(message);
  }
  async registerUser(newUser: any): Promise<void>{
    console.log('registering a new user');
    await this.http.post('http://localhost:3000/register', newUser).toPromise();
    console.log('register done');
  }

  /* get all the photos of the owner for profile
   */
  async getPhotos(owner: string){
    await this.http.get('http://localhost:3000/photos?').subscribe({
      next: data => {
        console.log(data);
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
    console.log('getting all photos of this owner');
  }

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
  async getProfile(username: string){
    console.log('get profile of this user');
    this.http.get('http://localhost:3000/profile?username=' + username,);
  }
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

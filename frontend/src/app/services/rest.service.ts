import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class RestService {


  constructor(private http: HttpClient) {

  }

  async registerUser(newUser: any): Promise<void>{
    console.log('registering a new user');
    await this.http.post('http://localhost:3000/register', newUser).toPromise();
    console.log('register done');
  }


}

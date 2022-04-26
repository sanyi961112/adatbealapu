import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: string = '';
  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.rest.getProfile(this.currentUser);
  }

}

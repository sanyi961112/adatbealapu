import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {RestService} from "../../services/rest.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: string = '';
  isLoggedIn: boolean = false;
  users: any;
  searchGroup = new FormGroup({
    searchValue: new FormControl({})
  });

  constructor(private rest: RestService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.searchGroup.reset();
    this.currentUser = JSON.stringify(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUser.replace('"', '');
    this.currentUser = this.currentUser.replace('"', '');
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  logOut(): void {
    this.currentUser = JSON.stringify(localStorage.setItem('currentUser', ''));
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn', JSON.stringify(this.isLoggedIn));
    this.toastr.success('Successful Logout!', 'Success')
  }

  toMyProfile() {
    this.router.navigate(['/profile', this.currentUser]).then();
  }

  toMyPhotos() {
    this.router.navigate(['/photos', this.currentUser]).then();
  }

  toPhotos() {
    const username = this.searchGroup.controls['searchValue'].value;
    console.log('to photos called');
    this.router.navigate(['/photos', username]).then();
  }

  getSomeUsers() {
    const currentSearch = this.searchGroup.controls['searchValue'].value;
    this.rest.getSomeUsers(currentSearch).subscribe(res => {
      console.log(res);
      this.users = res;
    });

  }


}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { PhotosComponent } from './pages/photos/photos.component';
import { PhotoComponent } from './pages/photo/photo.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    LoginComponent,
    ProfileComponent,
    PhotosComponent,
    PhotoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

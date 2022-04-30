import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from './pages/main/main.component';
import {LoginComponent} from './pages/login/login.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {PhotosComponent} from "./pages/photos/photos.component";
import {PhotoComponent} from "./pages/photo/photo.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'photos/:username',
    component: PhotosComponent,
    pathMatch: 'full'
  },
  {
    path: 'photo/:photoId',
    component: PhotoComponent,
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'main' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

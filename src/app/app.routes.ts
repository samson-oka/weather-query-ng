import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CurrentLocationComponent } from './current-location/current-location.component';
import { SearchLocationComponent } from './search-location/search-location.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'current-location', component: CurrentLocationComponent },
  { path: 'search-location', component: SearchLocationComponent },
];

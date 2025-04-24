import { Component } from '@angular/core';

@Component({
  selector: 'app-current-location',
  imports: [],
  templateUrl: './current-location.component.html',
  styleUrl: './current-location.component.scss'
})
export class CurrentLocationComponent {
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string | null = null;

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (typeof window === 'undefined' || !window.navigator || !window.navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your browser';
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = 'User denied the request for Geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            this.locationError = 'The request to get user location timed out';
            break;
          default:
            this.locationError = 'An unknown error occurred';
            break;
        }
      }
    );
  }

}

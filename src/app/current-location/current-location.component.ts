import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-current-location',
  imports: [MapComponent],
  templateUrl: './current-location.component.html',
  styleUrl: './current-location.component.scss'
})
export class CurrentLocationComponent {
  latitude: number | null = null;
  longitude: number | null = null;
  locationError: string | null = null;
  weatherData: any = null;
  weatherError: string | null = null;

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    if (typeof window === 'undefined' || !window.navigator || !window.navigator.geolocation) {
      this.locationError = 'Geolocation is not supported by your browser';
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      async (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        await this.fetchWeatherData();
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

  private async fetchWeatherData() {
    try {
      if (!this.latitude || !this.longitude) {
        throw new Error('Location data not available');
      }

      // Replace this URL with your actual weather API endpoint
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${this.latitude},${this.longitude}&key=3d059cf66b6d48009f314144252404`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.weatherData = await response.json();
      this.weatherError = null;
    } catch (error) {
      this.weatherError = error instanceof Error ? error.message : 'Failed to fetch weather data';
      this.weatherData = null;
    }
  }
}

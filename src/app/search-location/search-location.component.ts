import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-search-location',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent],
  templateUrl: './search-location.component.html',
  styleUrl: './search-location.component.scss'
})
export class SearchLocationComponent {
  searchQuery: string = '';
  location: { lat: number; lon: number } | null = null;
  placeName: string | null = null;
  weatherData: any = null;
  error: string | null = null;
  isLoading: boolean = false;

  async searchLocation() {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a location';
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      // First, get coordinates from the location name
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`
      );
      
      if (!geocodeResponse.ok) {
        throw new Error('Failed to fetch location data');
      }

      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.length === 0) {
        throw new Error('Location not found');
      }

      const firstResult = geocodeData[0];
      this.location = {
        lat: parseFloat(firstResult.lat),
        lon: parseFloat(firstResult.lon)
      };
      this.placeName = firstResult.display_name;

      // Then fetch weather data
      await this.fetchWeatherData();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred';
      this.location = null;
      this.weatherData = null;
    } finally {
      this.isLoading = false;
    }
  }

  private async fetchWeatherData() {
    try {
      if (!this.location) {
        throw new Error('Location data not available');
      }

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?q=${this.location.lat},${this.location.lon}&key=3d059cf66b6d48009f314144252404`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.weatherData = await response.json();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to fetch weather data';
      this.weatherData = null;
    }
  }
} 
import { Component, Input, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() location: { lat: number; lon: number } | null = null;
  @Input() placeName: string | null = null;
  @Input() weatherData: any = null;
  
  private map: any = null;
  private marker: any = null;
  private isBrowser: boolean;
  private L: any = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      await this.loadLeaflet();
      this.initMap();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.isBrowser && (changes['location'] || changes['placeName'])) {
      await this.loadLeaflet();
      this.updateMap();
    }
  }

  private async loadLeaflet() {
    if (!this.L) {
      this.L = await import('leaflet');
    }
  }

  private getCustomIcon() {
    return this.L.divIcon({
      className: 'custom-marker',
      html: '<span class="emoji-marker">📍</span>',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
  }

  private initMap() {
    if (!this.isBrowser || !this.L) return;

    // Initialize map with default view (will be updated when location is provided)
    this.map = this.L.map('map').setView([0, 0], 2);

    // Add OpenStreetMap tiles
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Update map if we already have location data
    if (this.location) {
      this.updateMap();
    }
  }

  private updateMap() {
    if (!this.map || !this.isBrowser || !this.L) return;

    // Clear existing marker if any
    if (this.marker) {
      this.marker.remove();
    }

    if (this.location) {
      // Set map view to the new location
      this.map.setView([this.location.lat, this.location.lon], 13);

      // Create and add new marker with custom icon
      this.marker = this.L.marker([this.location.lat, this.location.lon], {
        icon: this.getCustomIcon()
      }).addTo(this.map);

      // Add popup with weather information if available
      if (this.weatherData) {
        const popupContent = `
          <div class="weather-popup">
            <h3 class="popup-title">${this.placeName || 'Current Location'}</h3>
            <div class="popup-content">
              <div class="weather-info">
                <p class="temperature">${this.weatherData.current.temp_c}°C</p>
                <p class="condition">${this.weatherData.current.condition.text}</p>
              </div>
              <div class="additional-info">
                <p>Humidity: ${this.weatherData.current.humidity}%</p>
                <p>Wind: ${this.weatherData.current.wind_kph} km/h</p>
              </div>
            </div>
          </div>
        `;

        // Configure popup options
        const popupOptions = {
          className: 'custom-popup',
          maxWidth: 300,
          closeButton: true,
          autoClose: false,
          closeOnClick: false,
          offset: [0, -20] // Adjust popup position relative to marker
        };

        this.marker
          .bindPopup(popupContent, popupOptions)
          .openPopup();
      }
    }
  }
} 
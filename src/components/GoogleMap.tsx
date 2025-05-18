import { useEffect, useRef, useState } from 'react';
import GoogleMapsLoader from './GoogleMapsLoader';

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
  width?: string;
  title?: string;
  withSearch?: boolean;
  className?: string;
}

const GoogleMap = ({
  lat = 30.316495, // Default to Rishikesh coordinates
  lng = 78.09553,
  zoom = 15,
  height = '400px',
  width = '100%',
  title = 'Location',
  withSearch = false,
  className = ''
}: GoogleMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Initialize the map once Google Maps is loaded
    const initMap = () => {
      if (!mapContainerRef.current || !window.google || !window.google.maps) return;

      try {
        // Create a new map instance
        const mapOptions = {
          center: { lat, lng },
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        };

        const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);

        // Add a marker at the specified location
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map,
          title
        });

        // Add search functionality if requested
        if (withSearch && window.google.maps.places) {
          const input = document.createElement('input');
          input.placeholder = 'Enter an address';
          input.className = 'map-search-input';
          input.style.padding = '10px';
          input.style.margin = '10px';
          input.style.width = 'calc(100% - 20px)';
          input.style.boxSizing = 'border-box';
          input.style.border = '1px solid #ccc';
          input.style.borderRadius = '4px';

          const searchBox = new window.google.maps.places.SearchBox(input);
          map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(input);

          // Listen for the event when the user selects a prediction
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) return;

            // For each place, get the location
            const bounds = new window.google.maps.LatLngBounds();
            places.forEach((place: any) => {
              if (!place.geometry || !place.geometry.location) return;

              // Update marker position
              marker.setPosition(place.geometry.location);

              if (place.geometry.viewport) {
                // Only geocodes have viewport
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            map.fitBounds(bounds);
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google Map:', error);
        setLoadError(true);
        setIsLoading(false);
      }
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Otherwise wait for it to load
      const checkGoogleMapsInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMapsInterval);
          initMap();
        }
      }, 200);

      // Clear interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkGoogleMapsInterval);
        if (isLoading) {
          setLoadError(true);
          setIsLoading(false);
        }
      }, 10000);

      return () => clearInterval(checkGoogleMapsInterval);
    }
  }, [lat, lng, zoom, title, withSearch]);

  return (
    <>
      <GoogleMapsLoader 
        fallback={
          <div 
            style={{ 
              height, 
              width, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px'
            }}
            className={className}
          >
            {loadError ? (
              <p>Failed to load map</p>
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        } 
      />
      <div 
        ref={mapContainerRef} 
        style={{ height, width }} 
        className={className} 
      />
    </>
  );
};

export default GoogleMap;

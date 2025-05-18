import { useEffect, useState } from 'react';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBo4xh7u6NwHrEFiyPL_zq1lB6UgWINuBI';

interface GoogleMapsLoaderProps {
  fallback?: React.ReactNode;
}

// This component loads all required Google Maps scripts
const GoogleMapsLoader = ({ fallback }: GoogleMapsLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if scripts are already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
      // Script is loading but not ready
      const checkGoogleMapsInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true);
          clearInterval(checkGoogleMapsInterval);
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite loop
      setTimeout(() => {
        clearInterval(checkGoogleMapsInterval);
        if (!isLoaded) setHasError(true);
      }, 10000);

      return () => clearInterval(checkGoogleMapsInterval);
    }

    try {
      // Set up a global callback function for the Google Maps script
      window.initGoogleMaps = () => {
        setIsLoaded(true);
      };

      // Load the main Google Maps JavaScript API
      const mapsScript = document.createElement('script');
      mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initGoogleMaps&libraries=places&loading=async&v=weekly`;
      mapsScript.async = true;
      mapsScript.defer = true;
      mapsScript.onerror = () => {
        console.error('Failed to load Google Maps API');
        setHasError(true);
      };
      document.head.appendChild(mapsScript);

      // Add necessary styles
      const mapStyles = document.createElement('style');
      mapStyles.textContent = `
        gmp-map {
          height: 100%;
          width: 100%;
        }
        
        .place-picker-container {
          padding: 20px;
        }
      `;
      document.head.appendChild(mapStyles);

      // Cleanup function to prevent memory leaks
      return () => {
        // Remove global callback
        delete window.initGoogleMaps;
      };
    } catch (error) {
      console.error('Error setting up Google Maps:', error);
      setHasError(true);
      return undefined;
    }
  }, [isLoaded]);

  // Only return the fallback if explicitly provided and there's an error or still loading
  if (fallback && (hasError || !isLoaded)) {
    return <>{fallback}</>;
  }

  return null; // This component doesn't render anything visible
};

// Add necessary global type definitions
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export default GoogleMapsLoader;

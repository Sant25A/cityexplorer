export interface Location {
  address: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  location: Location;
  images: string[];
  averageRating: number;

  // UI helpers
  image: string;
  rating: number;
  isFavorite: boolean;
}
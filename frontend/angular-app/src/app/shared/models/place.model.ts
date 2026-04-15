export interface Place {
    id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    // lat?: number;
    // lng?: number;
    images: string[];
    averageRating: number;

    // UI helpers
    image: string;
    rating: number;
    isFavorite: boolean;
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  places = [
  {
    name: "Cafetería punta del cielo",
    location: "Tollocan",
    image: "https://picsum.photos/300/200?1",
    rating: 4.5
  },
  {
    name: "Alameda central",
    location: "Toluca Centro",
    image: "https://picsum.photos/300/200?2",
    rating: 4.7
  },
  {
    name: "Centro Tolzú",
    location: "Toluca Centro",
    image: "https://picsum.photos/300/200?3",
    rating: 4.8
  }
];

}
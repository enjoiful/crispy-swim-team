import { Component, Input } from '@angular/core';
import { SiteNamePipe } from '../site-name.pipe'; // Adjust the path as needed
import { DurationFormatPipe } from '../duration-format.pipe'
import { KitePipe } from '../kite.pipe'
import { CommonModule } from '@angular/common';  // Import CommonModule
import { openDB } from 'idb';




@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [SiteNamePipe, CommonModule, KitePipe, DurationFormatPipe],
  templateUrl: './session-card.component.html',
  styleUrl: './session-card.component.css'
})
export class SessionCardComponent {
  @Input() session: any;
  Math = Math
  profilePictureUrl: string = 'assets/profile-picture.jpg'; // You can use a dynamic URL here



  getColor(session: any) {
    return '--gray-700'
    if (session.spot.id == 10773) {
      return '--bright-blue'
    } else if (session.spot.id == 10511) {
      return '--hot-red'
    } else if (session.spot.id == 5842) {
      return '--french-violet' //--electric-violet 
    } else {
      return '--gray-700'
    }
  }


  imageSrc: string = ''; // This will be bound to the <img> src attribute
 
  localStorageKey: string;

  imageUrl: string = ''
  indexedDBKey: string = ''

  constructor() { }

  ngOnInit(): void {
    this.loadImage();
  }

  async loadImage() {
    // Check if the image is already cached in IndexedDB
    if (!this.session.user.profilepicid){
      this.imageSrc = 'emptypic.jpg'
      return
    }

    this.indexedDBKey = this.session.user.profilepicid 
    this.imageUrl = 'https://kiter-271715.appspot.com/image/profile/' + this.session.user.profilepicid; // The actual URL of your image

    const db = await this.openDatabase();
    const cachedImage = await db.get('images', this.indexedDBKey);

    if (cachedImage) {
      // If cached, create an object URL for the Blob and set it as the image source
      this.imageSrc = URL.createObjectURL(cachedImage);
    } else {
      // If not cached, fetch the image from the server
      this.fetchAndCacheImage(db);
    }
  }

  async fetchAndCacheImage(db: any) {
    try {
      const response = await fetch(this.imageUrl);
      const blob = await response.blob(); // Get the image as a Blob

      // Store the Blob in IndexedDB
      await db.put('images', blob, this.indexedDBKey);

      // Set the Blob as the image source
      this.imageSrc = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  // Function to open the IndexedDB database
  async openDatabase() {
    return await openDB('image-cache-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      }
    });
  }



}

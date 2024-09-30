import { Component, Input } from '@angular/core';
import { SiteNamePipe } from '../site-name.pipe'; // Adjust the path as needed
import { KitePipe } from '../kite.pipe'
import { CommonModule } from '@angular/common';  // Import CommonModule



@Component({
  selector: 'app-session-card',
  standalone: true,
  imports: [SiteNamePipe, CommonModule, KitePipe],
  templateUrl: './session-card.component.html',
  styleUrl: './session-card.component.css'
})
export class SessionCardComponent {
  @Input() session: any;
  profilePictureUrl: string = 'assets/profile-picture.jpg'; // You can use a dynamic URL here


  getColor(session: any) {
    console.log('sup')
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

}

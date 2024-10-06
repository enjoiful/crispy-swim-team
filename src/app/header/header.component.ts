import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

   constructor(private router: Router, private route: ActivatedRoute) {}


    isActiveRoute(baseRoute: string): boolean {
    const url = this.router.url;
    return url.startsWith(baseRoute);
  }

}

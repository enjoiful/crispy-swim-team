import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-details',
  standalone: true,
  imports: [],
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.css'
})
export class SiteDetailsComponent {
  id!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.id = Number(params.get('id'));
      // Now you can use 'this.id' in your component
    });
  }
}
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  @Input() title: string = 'Default Title';
  @Input() value: string = 'Default Value';
  
constructor(){
  console.log('sup yo')
}
}

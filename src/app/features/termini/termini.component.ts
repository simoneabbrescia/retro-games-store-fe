import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-termini',
  standalone: false,
  templateUrl: './termini.component.html',
  styleUrl: './termini.component.css'
})
export class TerminiComponent 
{
  currentYear: number = new Date().getFullYear();

  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

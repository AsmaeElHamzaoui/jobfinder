import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header';
import { FooterComponent } from '../../shared/components/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector:'app-home',
  standalone:true,
  imports:[CommonModule,HeaderComponent,FooterComponent,RouterModule],
  templateUrl:'./home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent{}

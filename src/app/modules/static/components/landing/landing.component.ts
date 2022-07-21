import { Component, OnInit } from '@angular/core';

declare global {
  interface Window {
     Calendly: any;
  }
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {}

  talkToAnExpert() {
    window.Calendly.initPopupWidget({
      url: 'https://calendly.com/shyft-to',
      parentElement: document.querySelector('.calendly-popup-widget'),
      prefill: {}
   });
  }
}

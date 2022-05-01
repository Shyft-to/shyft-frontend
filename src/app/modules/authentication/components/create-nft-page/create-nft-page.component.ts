import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-nft-page',
  templateUrl: './create-nft-page.component.html',
  styleUrls: ['./create-nft-page.component.scss']
})
export class CreateNftPageComponent implements OnInit {
  apiKey: string | null = "";
  constructor() { }

  ngOnInit(): void {
    this.apiKey = localStorage.getItem("api_key");
  }

}

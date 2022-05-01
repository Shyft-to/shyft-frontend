import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-to-nft',
  templateUrl: './access-to-nft.component.html',
  styleUrls: ['./access-to-nft.component.scss']
})
export class AccessToNftComponent implements OnInit {
  loginForm!: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      api_key: [],
    });
  }
  public login(body: any) {
    localStorage.setItem("api_key", body.api_key);
    this.isFormSubmitted = true;
    this.router.navigate(['/dashboard']);
  }

  

}

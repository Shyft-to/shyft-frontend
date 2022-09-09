import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetApiService } from 'src/app/core/http/get-api.service';

@Component({
  selector: 'app-get-api-page',
  templateUrl: './get-api-page.component.html',
  styleUrls: ['./get-api-page.component.scss'],
})
export class GetApiPageComponent implements OnInit {
  isSubmitted: boolean = false;
  registerForm!: FormGroup;
  isSuccessResponse: boolean = false;
  constructor(
    private _getApiService: GetApiService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$')]],
    });
  }
  public getApiKey(body: any) {
    this.isSubmitted = true;
    if (this.isSubmitted && this.registerForm.valid) {
      this.isSuccessResponse = true;
    }
    this._getApiService.getApiKey(body).subscribe((res) => {
      console.log(res);
      if (this.isSuccessResponse) {
        setTimeout(() => {
          setTimeout(() => {
            this.router.navigate(['/get-api-key']).then(() => {
              window.location.href = 'https://docs.shyft.to';
            });
          });
        }, 3000);
      }
    }, (errors: any) => {
      console.log(errors);
    });
  }
  get f() { return this.registerForm.controls; }

  public closeModal() {
    this.isSuccessResponse = false;
    this.router.navigate(['/dashboard']);
  }
}

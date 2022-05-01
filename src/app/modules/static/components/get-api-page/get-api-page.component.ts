import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetApiService } from 'src/app/core/http/get-api.service';

@Component({
  selector: 'app-get-api-page',
  templateUrl: './get-api-page.component.html',
  styleUrls: ['./get-api-page.component.scss'],
})
export class GetApiPageComponent implements OnInit {
  isSubmitted: boolean = false;
  registerForm!: FormGroup;
  constructor(private _getApiService: GetApiService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      emailId: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  public getApiKey(body: any) {
    this.isSubmitted = true;
    this._getApiService.getApiKey(body).subscribe((res) => {
      console.log(res);
    }, (errors: any) => {
      console.log(errors);
    });
  }
  get f() { return this.registerForm.controls; }

  public closeModal() {
    this.isSubmitted = false;
  }
}

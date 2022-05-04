import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateNftService } from 'src/app/core/http/create-nft.service';

@Component({
  selector: 'app-create-nft-page',
  templateUrl: './create-nft-page.component.html',
  styleUrls: ['./create-nft-page.component.scss']
})
export class CreateNftPageComponent implements OnInit {
  // apiKey: string | null = '';
  authorizationKey: string = 'f4366928-a6a2-41a0-ad40-d80805528132';
  mintTo: string = '0xbA7356120E28D862f6B0528900F6Af2dF08D6E34';
  image: any = 'assets/images/Sample-image.svg';
  createNftForm!: FormGroup;
  fileUpload = { status: '', message: '', filePath: '' };
  constructor(
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private createNftService: CreateNftService,
  ) {}

  ngOnInit(): void {
    // this.apiKey = localStorage.getItem("api_key");
    this.createNftForm = this.formBuilder.group({
      name: [''],
      file: [''],
      description: [''],
      mintTo: [''],
      authorizationKey: [''],
    });
  }
 
  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        this.image = this.domSanitizer.bypassSecurityTrustUrl(event.target.result);
      }
      
      this.createNftForm.get('file')?.setValue(file);
      this.createNftForm.get('name')?.setValue(file.name);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.createNftForm.get('name')?.value);
    formData.append('file', this.createNftForm.get('file')?.value);
    formData.append('mintTo', this.createNftForm.get('mintTo')?.value);
    formData.append('description', this.createNftForm.get('description')?.value);
    formData.append('authorizationKey', this.createNftForm.get('authorizationKey')?.value);
    console.log('name:', formData.get('name'));
    console.log('file:', formData.get('file'));
    console.log('mintTo:', formData.get('mintTo'));
    console.log('authorizationKey:', formData.get('authorizationKey'));
    console.log('description:', formData.get('description'));
    this.createNftService.createNft(formData).subscribe(
      (res: any) => {
        console.log(res);
        this.fileUpload = res;
        return this.fileUpload;
      }, (err: any) => {
        return err;
      }
    );
  }

}

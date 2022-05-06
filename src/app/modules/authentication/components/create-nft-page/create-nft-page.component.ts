import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateNftService } from 'src/app/core/http/create-nft.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-nft-page',
  templateUrl: './create-nft-page.component.html',
  styleUrls: ['./create-nft-page.component.scss'],
})
export class CreateNftPageComponent implements OnInit {
  // apiKey: string | null = '';
  isLoaded: boolean = true;
  authorizationKey: string | null = 'AUTHORIZATION_KEY';
  name: string | null = 'FILE_NAME';
  description: string | null = 'DESCRIPTION';
  mintTo: string = 'WALLET_ADDRESS';
  image: any = 'assets/images/Sample-image.svg';
  url: string = environment.url;
  defaultCurl: string = '';
  createNftForm!: FormGroup;
  fileUpload = { status: '', message: '', filePath: '' };
  response: any;
  constructor(
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    private createNftService: CreateNftService,
  ) {
    this.defaultCurl = `curl --location --request POST '${environment.url}' \
    --header 'Content-Type: application/json' \
    --form 'file=@"/path-to-your-file/${this.name}"' \
    --form 'mintTo="${this.mintTo}"' \
    --form 'name="wallet"' \
    --form 'description="${this.description}"' \
    --form 'authorizationKey="${this.authorizationKey}"'`;
  }

  ngOnInit(): void {
    // this.apiKey = localStorage.getItem("api_key");
    this.response = null;
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
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.image = this.domSanitizer.bypassSecurityTrustUrl(
          event.target.result
        );
      };

      this.createNftForm.get('file')?.setValue(file);
      this.createNftForm.get('name')?.setValue(file.name);
    }
  }

  onSubmit() {
    this.isLoaded = false; // on loader
    const formData = new FormData();
    formData.append('name', this.createNftForm.get('name')?.value);
    formData.append('file', this.createNftForm.get('file')?.value);
    formData.append('mintTo', this.createNftForm.get('mintTo')?.value);
    formData.append(
      'description',
      this.createNftForm.get('description')?.value
    );
    formData.append(
      'authorizationKey',
      this.createNftForm.get('authorizationKey')?.value
    );
    this.createNftService.createNft(formData).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.response = JSON.stringify(res);
          this.isLoaded = true; // off loader
        } else {
          this.fileUpload = res;
        }
      },
      (err: any) => {
        this.isLoaded = true; // off loader
        return err;
      }
    );
  }
  onChangeMintTo(event: string) {
    this.mintTo = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeDescription(event: string) {
    this.description = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeName(event: string) {
    this.name = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeAuthorizationKey(event: string) {
    this.authorizationKey = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  defaultCurlGenerator() {
    const curl = `curl --location --request POST '${this.url}' \
    --header 'Content-Type: application/json' \
    --form 'file=@"/path-to-your-file/${this.name}"' \
    --form 'mintTo="${this.mintTo}"' \
    --form 'name="wallet"' \
    --form 'description="${this.description}"' \
    --form 'authorizationKey="${this.authorizationKey}"'`;
    return curl;
  }

  copyCurl() {
    this.clipboardService.copyFromContent(this.defaultCurl);
    this.toastr.success('Copied!', '', {
      timeOut: 1500,
    });
  }

  copyTokenId() {
    if (this.response) {
      this.clipboardService.copyFromContent(JSON.parse(this.response).tokenId);      
      this.toastr.success('Copied!', '', {
        timeOut: 1500,
      });
    } else { 
      this.toastr.error('Please create NFT first!', '', {
        timeOut: 1500,
      });
    }
  }
}

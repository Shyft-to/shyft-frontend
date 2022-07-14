import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateNftService } from 'src/app/core/http/create-nft.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

interface Attribute {
  trait_type: string;
  value: string | number;
}

@Component({
  selector: 'app-create-nft-page',
  templateUrl: './create-nft-page.component.html',
  styleUrls: ['./create-nft-page.component.scss'],
})
export class CreateNftPageComponent implements OnInit {
  // apiKey: string | null = '';
  isSubmitted: boolean = false;
  isLoaded: boolean = true;
  authorizationKey: string = '';
  name: string | null = 'FILE_NAME';
  description: string | null = 'DESCRIPTION';
  private_key: string = '';
  symbol: string = '';
  network: string = 'devnet';
  max_supply: number = 1;
  royalty: number = 5;
  image: any = 'assets/images/blank-img.png';
  external_url: string = '';
  attributes: Attribute[] = [{ trait_type: 'edification', value: '100' }];
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
    private createNftService: CreateNftService
  ) {
    // this.defaultCurl = `curl --location --request POST '${environment.url}' \
    // --header 'Content-Type: application/json' \
    // --form 'file=@"/path-to-your-file/${this.name}"' \
    // --form 'mintTo="${this.mintTo}"' \
    // --form 'name="wallet"' \
    // --form 'description="${this.description}"' \
    // --form 'authorizationKey="${this.authorizationKey}"'`;
    this.defaultCurl = `curl -X 'POST' \
    'https://api.shyft.to/sol/v1/nft/create' \
    -H 'accept: application/json' \
    -H 'x-api-key: ${this.authorizationKey}' \
    -H 'Content-Type: multipart/form-data' \
    -F 'private_key=5GGZQpoiDHuWwt3GmwVGZPRJLwMonq4ozgMXyiQ5grbPzgF3k35dkBXywXvBBKbxvNq76L3teJcJ53Emsda92D5v' \
    -F 'max_supply=${this.max_supply}' \
    -F 'name=${this.name}' \
    -F 'royalty=${this.royalty}' \
    -F 'network=${this.network}' \
    -F 'attributes=${this.attributes}' \
    -F 'symbol=${this.symbol}' \
    -F 'external_url=${this.external_url}' \
    -F 'file=@1i8x_panda.jpeg;type=image/jpeg' \
    -F 'description=${this.description}'`;
  }

  async ngOnInit(): Promise<any> {
    // this.apiKey = localStorage.getItem("api_key");
    this.createNftForm = this.formBuilder.group({
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      file: ['', Validators.required],
      description: ['', Validators.required],
      attributes: [JSON.stringify(this.attributes), Validators.required],
      max_supply: [this.max_supply, Validators.required],
      royalty: [this.royalty, Validators.required],
      external_url: [''],
      private_key: [this.private_key, Validators.required],
      authorizationKey: [
        localStorage.getItem('authorizationKey') || '',
        Validators.required,
      ],
      network: [this.network, Validators.required],
    });
    // this.checkMetamask();
    // await this.connectAccount();
    this.createNftForm.patchValue({
      private_key: this.private_key,
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
    this.isSubmitted = true;
    if (this.createNftForm.invalid) {
      return;
    }
    this.isLoaded = false; // on loader
    const formData = new FormData();
    formData.append('name', this.createNftForm.get('name')?.value);
    formData.append('symbol', this.createNftForm.get('symbol')?.value);
    formData.append('file', this.createNftForm.get('file')?.value);
    formData.append(
      'private_key',
      this.createNftForm.get('private_key')?.value
    );
    formData.append('network', this.createNftForm.get('network')?.value);
    formData.append('attributes', this.createNftForm.get('attributes')?.value);
    formData.append('max_supply', this.createNftForm.get('max_supply')?.value);
    formData.append('royalty', this.createNftForm.get('royalty')?.value);
    formData.append(
      'external_url',
      this.createNftForm.get('external_url')?.value
    );
    formData.append(
      'description',
      this.createNftForm.get('description')?.value
    );
    
    // formData.append(
    //   'authorizationKey',
    //   this.createNftForm.get('authorizationKey')?.value
    // );
    this.createNftService.createNft(this.authorizationKey, formData).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.response = res;
          console.log(this.response);

          localStorage.setItem('authorizationKey', this.authorizationKey);
          this.isLoaded = true; // off loader
        } else {
          this.fileUpload = res;
        }
      },
      (err: any) => {
        this.response = null;
        this.isLoaded = true; // off loader
        return err;
      }
    );
  }
  onChangePrivateKey(event: string) {
    this.private_key = event;
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
  onChangeSymbol(event: string) {
    this.symbol = event.toUpperCase();
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeAuthorizationKey(event: string) {
    this.authorizationKey = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeAttributes(event: string) {
    this.attributes = JSON.parse(event);
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeMaxSupply(event: string) {
    this.max_supply = parseInt(event);
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeRoyalty(event: string) {
    this.royalty = parseInt(event);
    this.defaultCurl = this.defaultCurlGenerator();
  }
  onChangeExternalUrl(event: string) {
    this.external_url = event;
    this.defaultCurl = this.defaultCurlGenerator();
  }
  defaultCurlGenerator() {
    const curl = `curl -X 'POST' \
    'https://api.shyft.to/sol/v1/nft/create' \
    -H 'accept: application/json' \
    -H 'x-api-key: ${this.authorizationKey}' \
    -H 'Content-Type: multipart/form-data' \
    -F 'private_key=5GGZQpoiDHuWwt3GmwVGZPRJLwMonq4ozgMXyiQ5grbPzgF3k35dkBXywXvBBKbxvNq76L3teJcJ53Emsda92D5v' \
    -F 'max_supply=${this.max_supply}' \
    -F 'name=${this.name}' \
    -F 'royalty=${this.royalty}' \
    -F 'network=${this.network}' \
    -F 'attributes=${this.attributes}' \
    -F 'symbol=${this.symbol}' \
    -F 'external_url=${this.external_url}' \
    -F 'file=@1i8x_panda.jpeg;type=image/jpeg' \
    -F 'description=${this.description}'`;
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
      this.clipboardService.copyFromContent(this.response.tokenId);
      this.toastr.success('Copied!', '', {
        timeOut: 1500,
      });
    } else {
      this.toastr.error('Please create NFT first!', '', {
        timeOut: 1500,
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createNftForm.controls;
  }

  // checkMetamask() {
  //   if (typeof window.ethereum !== 'undefined') {
  //     console.log('MetaMask is installed!');
  //   } else {
  //     console.log('MetaMask is not installed!');
  //   }
  // }

  // async connectAccount() {
  //   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   this.mintTo = accounts[0];
  //   console.log('Metamask Address', this.mintTo);
  //   let balance = await window.ethereum.request({ method: 'eth_getBalance', params: [accounts[0],"latest"] });
  //   balance = ((parseInt(balance, 16)) / 1000000000000000000);
  //   console.log('Metamask Balance', balance);

  // }
}

declare global {
  interface Window {
    ethereum: any;
  }
}

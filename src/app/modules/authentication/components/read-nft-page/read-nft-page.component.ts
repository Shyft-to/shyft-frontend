import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReadNftService } from 'src/app/core/http/read-nft.service';
import { environment } from 'src/environments/environment';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-read-nft-page',
  templateUrl: './read-nft-page.component.html',
  styleUrls: ['./read-nft-page.component.scss'],
})
export class ReadNftPageComponent implements OnInit {
  isLoaded: boolean = true;
  response: any;
  readNftForm!: FormGroup;
  isSubmitted: boolean = false;
  tokenId: number = 79770;
  title: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Interdum netus fames viverra facil';
  image: string = '';
  mintToAddress: string = '0xb1efd79be9ac1fe6deaeeef3c56d04bccdc68130';
  nftURI: string =
    'ipfs://bafkreiaq25jbftokfte6rg7wfox237zwukbwg5njjr2mgitowzi42d5yby';
  curl: string = `curl --location --request POST '${environment.url}/tokenURI' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tokenId" : ${this.tokenId}
}'`;
  constructor(
    private formBuilder: FormBuilder,
    private readNftService: ReadNftService,
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.readNftForm = this.formBuilder.group({
      tokenId: ['', [Validators.required, Validators.pattern(/\d/)]],
    });
  }

  readNft(body: any): void {
    this.isSubmitted = true;
    if (this.readNftForm.valid) {
      this.isLoaded = false; // on loader
    }
    this.readNftService.readNft(body).subscribe(
      (response: any) => {
        this.response = JSON.stringify(response);
        const { tokenId, tokenURI } = response;
        const metaDataURI = `https://ipfs.io/ipfs/${tokenURI.split('/')[2]}`;
        this.readNftService.readMetaData(metaDataURI).then(
          (response: any) => {
            this.isLoaded = true; // off loader
            this.title = response.name;
            this.image = response.image;
            this.nftURI = response.image;
          },
          (error: any) => {
            throw new Error(error);
          }
        );
        this.tokenId = tokenId;
        this.readNftService.ownerOf({ tokenId }).then(
          (response: any) => {
            this.mintToAddress = response.owner;
          },
          (error: any) => {
            throw new Error(error);
          }
        );
      },
      (error: any) => {
        this.isLoaded = true; // off loader
        throw new Error(error);
      }
    );
  }

  onChangeTokenId(event: number) {
    this.tokenId = event;
    this.curl = this.defaultCurlGenerator();
  }

  defaultCurlGenerator() {
    const curl = `curl --location --request POST '${environment.url}/tokenURI' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tokenId" : ${this.tokenId}
}'`;
    return curl;
  }

  get f() {
    return this.readNftForm.controls;
  }

  copyCurl() {
    this.clipboardService.copyFromContent(this.curl);
    this.toastr.success('Copied!', '', {
      timeOut: 1500,
    });
  }

  copyTokenId() {
    if (this.response) {
      this.clipboardService.copyFromContent(JSON.parse(this.response).tokenId);
      console.log(JSON.parse(this.response).tokenId);
      
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

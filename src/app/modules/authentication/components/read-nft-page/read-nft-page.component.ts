import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReadNftService } from 'src/app/core/http/read-nft.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-read-nft-page',
  templateUrl: './read-nft-page.component.html',
  styleUrls: ['./read-nft-page.component.scss'],
})
export class ReadNftPageComponent implements OnInit {
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
    private readNftService: ReadNftService
  ) {}

  ngOnInit(): void {
    this.readNftForm = this.formBuilder.group({
      tokenId: ['', [Validators.required]],
    });
  }

  readNft(body: any): void {
    this.isSubmitted = true;
    this.readNftService.readNft(body).subscribe(
      (response: any) => {
        this.response = JSON.stringify(response);
        const { tokenId, tokenURI } = response;
        const metaDataURI = `https://ipfs.io/ipfs/${tokenURI.split('/')[2]}`;
        this.readNftService.readMetaData(metaDataURI).then(
          (response: any) => {
            this.title = response.name;
            this.image = response.image;
            this.nftURI = response.image;
          },
          (error: any) => {
            throw new Error(error);
          }
        );
        this.tokenId = tokenId;
        this.readNftService.ownerOf({ tokenId }).then((response: any) => {
          this.mintToAddress = response.owner;
        });
      },
      (error: any) => {
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
}

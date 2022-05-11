import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from "@solana/web3.js";
import { Connection } from '@metaplex/js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ReadNftService } from 'src/app/core/http/read-nft.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

enum IsResponse {
  success,
  failed,
  notInitiated,
}
interface Nft {
  tokenId: number;
  image: string;
}
interface Wallet {
  address: string;
}

@Component({
  selector: 'app-list-nft-page',
  templateUrl: './list-nft-page.component.html',
  styleUrls: ['./list-nft-page.component.scss']
})

export class ListNftPageComponent implements OnInit {
  wallet: Wallet = { address: '' };
  connection: any;
  nftsMetaData: any[] = [];
  nftList: Nft[] = [];
  ResponseStatus = IsResponse;
  isResponse: IsResponse = IsResponse.notInitiated;
  listNftForm!: FormGroup;
  isSubmitted: boolean = false;
  isLoaded: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private readNftService: ReadNftService,
  ) {}

  ngOnInit(): void {
    this.checkSolana();
    this.connectWallet();
    this.listNftForm = this.formBuilder.group({
      address: ['', [Validators.required]],
    });    
  }

  checkSolana() {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    console.log("Phantom installed", isPhantomInstalled);
  }

  async connectWallet(): Promise<any> {
    try {
      const network = 'mainnet-beta';
      const resp = await window.solana.connect();
      this.wallet = { address: resp.publicKey.toString() };
      const rpcUrl = solanaWeb3.clusterApiUrl(network);
      this.connection = new solanaWeb3.Connection(rpcUrl, "confirmed");
      const accountInfo = await this.connection.getAccountInfo(new solanaWeb3.PublicKey(this.wallet.address), "confirmed");
      const balance = await this.connection.getBalance(new solanaWeb3.PublicKey(this.wallet.address), "confirmed");
      console.log("Balance", balance / solanaWeb3.LAMPORTS_PER_SOL);
      console.log('Wallet', this.wallet);
      console.log('Account info', accountInfo);
      this.listNftForm = this.formBuilder.group({
        address: [this.wallet.address, [Validators.required]],
      });
    } catch (err) {
      console.error(err);
      // { code: 4001, message: 'User rejected the request.' }
    }
  }

  async listNfts(walletId: Wallet): Promise<any> {
    this.isSubmitted = true;
    this.isLoaded = false;
    
    const connection = new Connection('mainnet-beta');
    // const ownerPublickey = '8g8ej28R8A9p3SRKhcMjBqyD6NvXaKDLkVFJoyD6bvKe';
    const nftsmetadata = await Metadata.findDataByOwner(connection, walletId.address);
    this.nftsMetaData = nftsmetadata;
    if (this.nftsMetaData.length === 0) { 
      this.isResponse = IsResponse.failed;
      this.isLoaded = true;
    }
    this.nftsMetaData.map((nft) => {
      this.readNftService.readMetaData(nft.data.uri).then(
        (response: any) => {
          this.nftList.push({ tokenId: response.tokenId, image: response.image });
          this.isResponse = IsResponse.success;
          this.isLoaded = true;
        },
        (error: any) => {
          this.nftList = [];
          this.isResponse = IsResponse.failed;
          throw new Error(error);
        }
      );
    });
  }

  get f() { return this.listNftForm.controls; }

}

declare global {
  interface Window {
    solana: any;
  }
}

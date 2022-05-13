import { Component, OnInit } from '@angular/core';
import * as solanaWeb3 from '@solana/web3.js';
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
  name: string;
  image: string;
  description: string;
}
interface Wallet {
  address: string;
}

@Component({
  selector: 'app-list-nft-page',
  templateUrl: './list-nft-page.component.html',
  styleUrls: ['./list-nft-page.component.scss'],
})
export class ListNftPageComponent implements OnInit {
  wallet: Wallet = { address: '' };
  connection: any;
  nftsMetaData: any[] = [];
  nftList: Nft[] = [];
  similarNftList: Nft[] = [];
  ResponseStatus = IsResponse;
  isResponse: IsResponse = IsResponse.notInitiated;
  listNftForm!: FormGroup;
  isSubmitted: boolean = false;
  isLoaded: boolean = true;
  isViewMode: boolean = false;
  index: number = 0;
  isShowLess: boolean = true;
  selectedNft: Nft;

  constructor(
    private formBuilder: FormBuilder,
    private readNftService: ReadNftService
  ) {
    this.selectedNft = this.nftList[0];
  }

  ngOnInit(): void {
    this.checkSolana();
    this.connectWallet();
    this.listNftForm = this.formBuilder.group({
      address: ['', [Validators.required]],
    });
  }

  checkSolana() {
    const isPhantomInstalled = window.solana && window.solana.isPhantom;
    console.log('Phantom installed', isPhantomInstalled);
  }

  async connectWallet(): Promise<any> {
    try {
      const network = 'mainnet-beta';
      const resp = await window.solana.connect();
      this.wallet = { address: resp.publicKey.toString() };
      const rpcUrl = solanaWeb3.clusterApiUrl(network);
      this.connection = new solanaWeb3.Connection(rpcUrl, 'confirmed');
      const accountInfo = await this.connection.getAccountInfo(
        new solanaWeb3.PublicKey(this.wallet.address),
        'confirmed'
      );
      const balance = await this.connection.getBalance(
        new solanaWeb3.PublicKey(this.wallet.address),
        'confirmed'
      );
      console.log('Balance', balance / solanaWeb3.LAMPORTS_PER_SOL);
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
    this.nftList = [];
    this.isSubmitted = true;
    this.isLoaded = false;

    const connection = new Connection('mainnet-beta');
    // const ownerPublickey = '8g8ej28R8A9p3SRKhcMjBqyD6NvXaKDLkVFJoyD6bvKe';
    const nftsmetadata = await Metadata.findDataByOwner(
      connection,
      walletId.address
    );
    console.log('nftMetaData', nftsmetadata);

    this.nftsMetaData = nftsmetadata;
    if (this.nftsMetaData.length === 0) {
      this.isResponse = IsResponse.failed;
      this.isLoaded = true;
    }
    this.nftsMetaData.map((nft) => {
      this.readNftService.readMetaData(nft.data.uri).then(
        (response: any) => {
          this.nftList.push({
            name: response.name,
            image: response.image,
            description: response.description,
          });
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
    console.log('nftList', this.nftList);
  }

  nftView(index: number): void {
    this.index = index;
    this.isViewMode = true;
    this.selectedNft = this.nftList[index];
    this.similarNftList = this.nftList;
    this.similarNftList = this.similarNftList
      .slice(0, index)
      .concat(this.similarNftList.slice(index + 1)); // remove the selected nft from the list
  }

  changeView(): void {
    this.isViewMode = false;
  }

  showDetail(index: number): void {
    let selectedNft = this.similarNftList[index];
    this.similarNftList.push(this.selectedNft);
    this.similarNftList = this.similarNftList.slice(0, index).concat(this.similarNftList.slice(index + 1));
    this.selectedNft = selectedNft;
  }

  showMoreLess(): void {
    this.isShowLess = !this.isShowLess;
  }

  get f() {
    return this.listNftForm.controls;
  }
}

declare global {
  interface Window {
    solana: any;
  }
}

import { Component, OnInit } from '@angular/core';
import { actions } from '@metaplex/js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import {
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
  Connection,
} from '@solana/web3.js';
import {
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { ReadNftService } from 'src/app/core/http/read-nft.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

enum IsResponse {
  success,
  failed,
  notInitiated,
}
interface Nft {
  tokenAddress: string;
  name: string;
  image: string;
  description: string;
  symbol: string;
  attributes: any[];
  properties: {
    creators: [
      {
        address: string;
        share: number;
      }
    ];
  };
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
  resp: any;
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
  isDeletedNft: boolean = false;
  isDeletingNft: boolean = false;

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
      const network = 'devnet';
      // const resp = await window.solana.connect();
      this.resp = new PhantomWalletAdapter();
      await this.resp.connect();
      console.log(this.resp.publicKey?.toString());

      this.wallet = { address: this.resp.publicKey?.toString() };
      const rpcUrl = clusterApiUrl(network);
      this.connection = new Connection(rpcUrl, 'confirmed');
      console.log(this.resp);

      if (this.wallet.address) {
        const accountInfo = await this.connection.getAccountInfo(
          new PublicKey(this.wallet.address),
          'confirmed'
        );
        const balance = await this.connection.getBalance(
          new PublicKey(this.wallet.address),
          'confirmed'
        );
        console.log('Balance', balance / LAMPORTS_PER_SOL);
        console.log('Wallet', this.wallet);
        console.log('Account info', accountInfo);
      }
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
    const nftsmetadata = await Metadata.findDataByOwner(
      this.connection,
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
            tokenAddress: nft.mint,
            name: response.name,
            image: response.image,
            description: response.description,
            symbol: response.symbol,
            attributes: response.attributes,
            properties: response.properties,
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
    this.isDeletedNft = false;
    let selectedNft = this.similarNftList[index];
    this.similarNftList.push(this.selectedNft);
    this.similarNftList = this.similarNftList
      .slice(0, index)
      .concat(this.similarNftList.slice(index + 1));
    this.selectedNft = selectedNft;
  }

  showMoreLess(): void {
    this.isShowLess = !this.isShowLess;
  }

  async burnNft() {
    try {
      this.isDeletingNft = true;
      const associatedAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        new PublicKey(this.selectedNft.tokenAddress),
        this.resp.publicKey
      );

      const result = await actions.burnToken({
        connection: this.connection,
        wallet: this.resp,
        token: associatedAddress,
        mint: new PublicKey(this.selectedNft.tokenAddress),
        amount: 1,
        owner: this.resp.publicKey,
        close: false,
      });
      // remove from list
      const index = this.nftList.indexOf(this.selectedNft);
      this.nftList.splice(index, 1);
      console.log(result);
      this.isDeletingNft = false;
      setTimeout(() => {
        this.isViewMode = false;
      }, 500);
    } catch (err) {
      this.isDeletingNft = false;
      this.isDeletedNft = false;
    }
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

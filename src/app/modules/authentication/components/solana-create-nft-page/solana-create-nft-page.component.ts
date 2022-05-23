import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CreateNftService } from 'src/app/core/http/create-nft.service';
import { LAMPORTS_PER_SOL, clusterApiUrl, PublicKey, Connection } from '@solana/web3.js';
import { actions } from '@metaplex/js';
import { NFTStorage } from 'nft.storage';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const storageClient = new NFTStorage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGZGMUMyQ0IxY2M4ZUI2OWE1MDVEZDM5YjU1NGUwQUM0RkJCMWY2QjAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MjM4Mzk3OTUyNywibmFtZSI6InNoeWZ0In0.Yu2UPw5UBCsddrE4-fdcIp8oPiVy0VjTlSTJgku-EUw',
});

interface Wallet {
  address: string;
}

interface IpfsUploadResponse {
  cid: string;
  uri: string;
}

@Component({
  selector: 'app-solana-create-nft-page',
  templateUrl: './solana-create-nft-page.component.html',
  styleUrls: ['./solana-create-nft-page.component.scss'],
})
export class SolanaCreateNftPageComponent implements OnInit {
  // apiKey: string | null = '';
  isSubmitted: boolean = false;
  resp: any;
  isLoaded: boolean = true;
  isSuccessResponse: boolean = false;
  authorizationKey: string = '';
  name: string | null = 'FILE_NAME';
  description: string | null = 'DESCRIPTION';
  mintTo: string = '';
  wallet: Wallet = { address: '' };
  connection: any;
  publicKey: any;
  image: any = 'assets/images/blank-img.png';
  createNftForm!: FormGroup;
  fileUpload = { status: '', message: '', filePath: '' };
  response: any;
  constructor(
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private createNftService: CreateNftService
  ) {}

  async ngOnInit(): Promise<any> {
    // this.apiKey = localStorage.getItem("api_key");
    this.response = null;
    this.checkSolana();
    this.createNftForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      symbol: ['', [Validators.required]],
      file: ['', [Validators.required]],
      description: [''],
      address: [this.wallet.address || '', [Validators.required]],
      // authorizationKey: [localStorage.getItem('authorizationKey') || ''],
    });
    await this.connectWallet();
    this.createNftForm.patchValue({
      address: this.wallet.address,
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

  async onSubmit() {
    try {
      console.log(this.createNftForm);
      this.isSubmitted = true;
      if (this.isSubmitted && this.createNftForm.valid) {
        this.isLoaded = false; // on loader
        const formData = new FormData();
        formData.append('name', this.createNftForm.get('name')?.value);
        formData.append('symbol', this.createNftForm.get('symbol')?.value);
        formData.append('file', this.createNftForm.get('file')?.value);
        formData.append('address', this.createNftForm.get('address')?.value);
        formData.append(
          'description',
          this.createNftForm.get('description')?.value
        );
        // formData.append(
        //   'authorizationKey',
        //   this.createNftForm.get('authorizationKey')?.value
        // );
        await this.mintNft(formData);
        setTimeout(() => {
          this.isLoaded = true; // off loader
          this.isSuccessResponse = true;
        }, 2000);
        // await this.prepareMetaData()
      }
    } catch (error) {
      console.error('Error', error);
      this.isLoaded = true;
    }
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
    } catch (err) {
      console.error(err);
      // { code: 4001, message: 'User rejected the request.' }
    }
  }

  async prepareMetaData(formData: any) {
    console.log('preparing metadata URI');
    const name = formData.get('name');
    const symbol = formData.get('symbol');
    const description = formData.get('description');
    const file = formData.get('file');

    if (file != null) {
      const { uri } = await this.uploadToIPFS(file);
      console.log('image uploaded: ', uri);
      const metadata = JSON.stringify({
        name,
        description,
        symbol,
        image: uri,
        attributes: [],
        properties: {
          creators: [{ address: this.wallet.address, share: 100 }],
        },
      });

      const uploadResponse = await this.uploadToIPFS(
        new Blob([metadata], { type: 'application/json' })
      );
      return uploadResponse.uri;
    } else {
      return null;
    }
  }

  async uploadToIPFS(file: any): Promise<IpfsUploadResponse> {
    const ipfstx = await storageClient.storeBlob(file);
    console.log(ipfstx);
    return { cid: ipfstx, uri: `https://ipfs.io/ipfs/${ipfstx}` };
  }

  async mintNft(formData: any) {
    const metaUri = await this.prepareMetaData(formData);
    if (!metaUri) {
      throw new Error('No metadata URI');
    }
    console.log('meta URI generated: ', metaUri);
    const nft = await actions.mintNFT({
      connection: this.connection,
      wallet: this.resp,
      uri: metaUri,
      maxSupply: 1,
    });
    console.log('NFT is', nft);
  }

  public closeModal() {
    this.isSuccessResponse = false;
  }

  get f() {
    return this.createNftForm.controls;
  }
}

declare global {
  interface Window {
    solana: any;
  }
}

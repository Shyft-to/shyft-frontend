import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReadNftService {
  private _url: string;
  constructor(private _http: HttpClient) {
    this._url = environment.url;
  }

  public readNft(body: any): Observable<any> {
    return this._http.post<any>(
      `${this._url}/tokenURI`,
      body,
    );
  }

  public readMetaData(metaDataURI: string): Promise<any> {
    return this._http.get<any>(
      metaDataURI,
    ).toPromise();
  }

  public ownerOf(tokenID: any): Promise<any> {
    return this._http.post<any>(
      `${this._url}/ownerOf`,
      tokenID,
    ).toPromise();
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListNftService {
  private _url: string
  constructor(private _http: HttpClient) {
    this._url = environment.url;
  }

  public listNft(authorizationKey: string, formData: any): Observable<any> {
    console.log(authorizationKey);
    
    return this._http
      .get<any>(`${this._url}/nft/read_all`, {
        params: {
          network: formData.get('network'),
          address: formData.get('address'),
          update_authority: formData.get('update_authority'),
        },
        headers: new HttpHeaders({ 'x-api-key': authorizationKey }),
        responseType: 'json',
      }).pipe()
  }
}

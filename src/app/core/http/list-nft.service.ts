import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListNftService {
  constructor(private _http: HttpClient) {}

  public readMetaData(metaDataURI: string): Observable<any> {
    return this._http.get<any>(
      metaDataURI,
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CreateNftService {
  private _url: string;
  constructor(private _http: HttpClient) {
    this._url = environment.url;
  }

  public createNft(formData: any): Observable<any> {
    return this._http.post<any>(`${this._url}/createNft`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'json'
    }).pipe(map(event => this.getEventMessage(event, formData)),
      catchError(this.handleError));
  }

  private getEventMessage(event: HttpEvent<any>, formData: any) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
      case HttpEventType.Response:
        return this.apiResponse(event);
      default:
        return `File "${formData.get('file')}" surprising upload event: ${event.type}.`;
    }
  }

  private fileUploadProgress(event: any) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }
  private apiResponse(event: any) {
    return event.body;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

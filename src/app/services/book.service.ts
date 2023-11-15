import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiBaseUrl = 'https://api.itbook.store/1.0';

  constructor(private http: HttpClient) {}
  //Method to search books based on a sesarch query
  searchBooks(queryString: string): Observable<any> {
    if (queryString) {
      console.log('searchBooks called with queryString:', queryString);
      return this.http.get(`${this.apiBaseUrl}/search/${queryString}`);
    } else {
      return this.getNewBooks();
    }
  }
  getNewBooks(): Observable<any> {
    console.log('Fetching new books');
    return this.http.get(`${this.apiBaseUrl}/new`);
  }
}

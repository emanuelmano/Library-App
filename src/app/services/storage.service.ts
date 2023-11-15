import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  getBooks(): any[] {
    const bookJson = localStorage.getItem('books');
    return bookJson ? JSON.parse(bookJson) : [];
  }

  saveBooks(books: any) {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

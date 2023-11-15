// book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import {
  AddBook,
  BookState,
  DeleteBook,
  FetchAllBooks,
  UpdateBook,
} from '../states/book.state';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  newBook: any = {
    title: '',
    author: '',
  };
  editingBook: any = null;
  private booksSubscription!: Subscription;

  constructor(private store: Store) {}

  ngOnInit() {
    // Manually subscribe to the books observable
    console.log('Component initialized, books loaded', this.books);
    this.booksSubscription = this.store
      .select(BookState.getBookList)
      .subscribe((books) => {
        this.books = books;
      });

    // Dispatch action to load books
    this.store.dispatch(new FetchAllBooks());
  }
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.booksSubscription) {
      this.booksSubscription.unsubscribe();
    }
  }

  addBook(bookData?: any) {
    console.log('Attempting to add/update book with data:', bookData);
    if (this.editingBook) {
      console.log('Updating book:', { ...this.editingBook, ...bookData });
      this.store
        .dispatch(new UpdateBook({ ...this.editingBook, ...bookData }))
        .subscribe(() => {
          this.cancelEdit();
        });
    } else {
      console.log('Adding new book:', bookData);
      this.store.dispatch(new AddBook(bookData)).subscribe(() => {
        this.cancelEdit();
      });
    }
  }

  editBook(book: any) {
    console.log('Editing book:', book);
    this.editingBook = { ...book };
    this.newBook = { ...book }; //Populate the form with book details
  }
  cancelEdit() {
    console.log('Cancel edit. Resetting form and clearing editingBook.');
    this.editingBook = null;
    this.newBook = { title: '', author: '', subtitle: '' };
  }

  deleteBook(isbn13: string) {
    this.store.dispatch(new DeleteBook(isbn13));
  }
}

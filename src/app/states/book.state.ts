import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap } from 'rxjs/operators';
import { BookService } from '../services/book.service';
import { StorageService } from '../services/storage.service';
import { throwError } from 'rxjs';

export interface BookStateModel {
  books: any[];
}
export class FetchAllBooks {
  static readonly type = '[Book] Fetch All';
}
export class SearchBooks {
  static readonly type = '[Book] Search';
  constructor(public payload: string) {}
}

export class AddBook {
  static readonly type = '[Book] Add';
  constructor(public book: any) {
    this.book.isbn13 = this.book.isbn13 || `FAKE-ISBN-${Date.now()}`;
  }
}

export class DeleteBook {
  static readonly type = '[Book] Delete';
  constructor(public isbn13: string) {}
}

export class UpdateBook {
  static readonly type = '[Book] Update';
  constructor(public book: any) {}
}

export class LoadBookFromStorage {
  static readonly type = '[Book] Load from Storage';
}

@State<BookStateModel>({
  name: 'books',
  defaults: {
    books: [],
  },
})
@Injectable() // Ensure that the state is injectable
export class BookState {
  constructor(
    private bookService: BookService,
    private storageService: StorageService
  ) {}

  @Selector()
  static getBookList(state: BookStateModel) {
    return state.books;
  }

  @Action(FetchAllBooks)
  fetchAllBooks({ getState, patchState }: StateContext<BookStateModel>) {
    console.log('FetchAllBooks action dispached');
    //Get books from local storage first
    const state = getState();
    const booksFromStorage = this.storageService.getBooks();

    return this.bookService.getNewBooks().pipe(
      tap((response) => {
        console.log('Fetched books from API:', response);

        //Create a mam to track seen books by ISNB
        const seenBooks = new Map(
          state.books.map((book) => [book.isbn13, book])
        );
        booksFromStorage.forEach((book) => seenBooks.set(book.isbn13, book));
        response.books.forEach((book: { isbn13: any }) =>
          seenBooks.set(book.isbn13, book)
        );
        patchState({
          books: Array.from(seenBooks.values()),
        });
      }),
      catchError((error) => {
        console.log('Error fetching new books:', error);
        patchState({ books: state.books });
        return throwError(() => new Error('Error fetching new books'));
      })
    );
  }
  @Action(SearchBooks)
  searchBooks(ctx: StateContext<BookStateModel>, action: SearchBooks) {
    return this.bookService.searchBooks(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          books: response.books,
        });
      })
    );
  }

  @Action(AddBook)
  addBook(ctx: StateContext<BookStateModel>, action: AddBook) {
    const state = ctx.getState();
    const updatedBooklist = [...state.books, action.book];
    ctx.patchState({ books: updatedBooklist });
    //Save the updated book list to local storage
    this.storageService.saveBooks(updatedBooklist);
  }

  @Action(LoadBookFromStorage)
  loadBooksFromStorage({ patchState }: StateContext<BookStateModel>) {
    const booksFromStorage = this.storageService.getBooks();
    patchState({ books: booksFromStorage });
  }

  @Action(DeleteBook)
  deleteBook(ctx: StateContext<BookStateModel>, action: DeleteBook) {
    const state = ctx.getState();
    const filteredBooks = state.books.filter(
      (book) => book.isbn13 !== action.isbn13
    );
    ctx.patchState({ books: filteredBooks });
    this.storageService.saveBooks(filteredBooks);
  }

  @Action(UpdateBook)
  updateBook(ctx: StateContext<BookStateModel>, action: UpdateBook) {
    const state = ctx.getState();
    const updatedBooks = state.books.map((book) =>
      book.isbn13 === action.book.isbn13 ? { ...book, ...action.book } : book
    );
    ctx.patchState({ books: updatedBooks });
    //Save the updated book list to local storage
    this.storageService.saveBooks(updatedBooks);
  }
}

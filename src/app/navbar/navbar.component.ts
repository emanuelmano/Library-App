import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState, LogoutAction } from '../states/auth.state';
import { SearchBooks } from '../states/book.state';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isAuthenticated$!: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(AuthState.isAuthenticated);
  }

  logout() {
    this.store.dispatch(new LogoutAction());
  }

  handleSearch(term: string) {
    this.store.dispatch(new SearchBooks(term));
    console.log('Handle Search:', term);
  }
}

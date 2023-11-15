import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchComponent } from './search/search.component';
import { BookListComponent } from './book-list/book-list.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { AuthGuard } from './auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './services/book.service';
import { BookState } from './states/book.state';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },

  {
    path: 'books',
    loadChildren: () =>
      import('./books/books.module').then((m) => m.BooksModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'user-dashboard',
    loadChildren: () =>
      import('./user-dashboard/user-dashboard.module').then(
        (m) => m.UserDashboardModule
      ),
    canActivate: [AuthGuard],
  },
];
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SearchComponent,
    BookListComponent,
    UserDashboardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NgxsModule.forRoot([AuthState, BookState]),
    NgxsRouterPluginModule.forRoot(),
    HttpClientModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

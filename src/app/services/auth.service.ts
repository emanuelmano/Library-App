import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(credentials: { username: string; password: string }): Observable<any> {
    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = 'admin';

    if (
      credentials.username === VALID_USERNAME &&
      credentials.password === VALID_PASSWORD
    ) {
      const response = {
        token: 'SIMULATED_TOKEN_12345',
        user: {
          id: 1,
          username: 'admin',
        },
      };
      return of(response);
    } else {
      return throwError('Invalid username or password');
    }
  }

  logout() {}
}

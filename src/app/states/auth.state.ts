import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export class LoginAction {
  static readonly type = '[Auth] Login';
  constructor(public payload: { username: string; password: string }) {}
}

export class LogoutAction {
  static readonly type = '[Auth] Logout';
}

//Define state model

export interface AuthStateModule {
  token: string | null;
  user: string | null;
}

//Define Actions

@State<AuthStateModule>({
  name: 'auth',
  defaults: {
    token: null,
    user: null,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static token(state: AuthStateModule) {
    return state.token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModule): boolean {
    return !!state.token;
  }

  constructor(private authService: AuthService, private router: Router) {}
  @Action(LoginAction)
  login(ctx: StateContext<AuthStateModule>, action: LoginAction) {
    return this.authService.login(action.payload).pipe(
      tap((result) => {
        ctx.patchState({
          token: result.token,
          user: result.user,
        });
        this.router.navigate(['/books']);
      })
    );
  }

  @Action(LogoutAction)
  logout(ctx: StateContext<AuthStateModule>) {
    ctx.setState({
      token: null,
      user: null,
    });
    this.router.navigate(['/login']);
  }
}

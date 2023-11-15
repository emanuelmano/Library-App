import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { AuthService } from '../services/auth.service';
import { AuthState } from '../states/auth.state';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forFeature([AuthState]),
    ReactiveFormsModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}

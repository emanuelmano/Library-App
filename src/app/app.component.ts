import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuthState } from './states/auth.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'library-app';
}

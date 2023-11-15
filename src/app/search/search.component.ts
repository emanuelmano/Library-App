import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Output() searchEvent = new EventEmitter<string>();
  private searchTerms = new Subject<string>();

  constructor() {
    this.searchTerms
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged() // only emit if value is different from previous value
      )
      .subscribe((term) => this.searchEvent.emit(term));
  }

  search(term: string) {
    console.log('Search Term:', term);
    this.searchTerms.next(term);
  }

  onInput(event: Event) {
    const input = event?.target as HTMLInputElement;
    this.search(input.value);
  }
}

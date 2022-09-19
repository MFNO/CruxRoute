import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  template: ` <p>base works!</p> `,
  styles: [],
})
export class BaseComponent {
  protected onDestroy$ = new Subject<boolean>();

  protected constructor() {
    this.onDestroy$ = new Subject<boolean>();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next(false);
    this.onDestroy$.complete();
  }
}

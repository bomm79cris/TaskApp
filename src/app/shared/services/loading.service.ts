import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private showLoader: BehaviorSubject<boolean>;
  public showLoader$:Observable<boolean>;

  constructor(){
    this.showLoader = new BehaviorSubject<boolean>(false);
    this.showLoader$ = this.showLoader.pipe(
      switchMap(showLoader => {
        if(!showLoader) {
          return of(false);
        }
        return of(true).pipe(delay(400));
      })
    );
  }

  showLoading(){
    this.showLoader.next(true);
  }

  hideLoading(){
    this.showLoader.next(false);
  }
}

import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  showLoading:boolean;
  courseSubscription = new Subscription();

  constructor(public loaderService:LoadingService, private cd: ChangeDetectorRef) {
    this.showLoading = false;
  }

  ngOnInit(): void {
    this.courseSubscription = this.loaderService.showLoader$.subscribe((state:boolean) => {
      this.showLoading = state;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.courseSubscription.unsubscribe();
  }

}

import { ChangeDetectorRef, Component } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  messages: Message[] = [];
  private subscription: Subscription;
  constructor(public messageService:MessageService, private cd: ChangeDetectorRef) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.subscription = this.messageService.getMessagesObservable().subscribe(
      (messages) => {
        this.messages = messages;
        this.cd.detectChanges();
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
 }
}

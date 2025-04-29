import { Injectable } from '@angular/core';
import { Message } from 'primeng/api'; 
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  private timeOut : any;
  private messageSubject = new Subject<Message[]>();

  constructor() {
    this.messageSubject.next(this.messages);
  }

  getMessagesObservable() {
    return this.messageSubject.asObservable();
  }
  addMessage(message: Message) {
    this.messages.push(message);
    
    this.messageSubject.next(this.messages);
    
  
      this.timeOut = setTimeout(() => {
        this.clearMessages()
      }, 6000);


  }
  clearMessages() {
    this.messages = [];
  }

}

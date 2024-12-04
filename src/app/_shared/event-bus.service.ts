import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventData } from './event.class';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private subject = new Subject<any>();

  emit(event: string, data?: any): void {
    this.subject.next({ event, data });
  }

  on(event: string, action: any): Subscription {
    return this.subject.asObservable().subscribe(({ event: e, data }) => {
      console.log(data);
      console.log(event);
      if (e === event) {
        console.log(event)
        action(data);
      }
    });
  }
}

import * as Rx from '@reactivex/rxjs'
import 'rxjs/add/operator/map';
import UUID = require('uuid');

import {ThreadAggregate, CommandRequest, CreateThread, Event, UpdateThreadName} from './thread.aggregate';

describe('Thread', () => {
    it('send msg', () => {
      let subscriber = Rx.Subscriber.create((msg: Event) => {
        console.log(msg);
      });

      let threadAggregate = new ThreadAggregate(subscriber, UUID.v4());

      let observable: Rx.Observable<CommandRequest> = Rx.Observable.create((observer: Rx.Observer<CommandRequest>) => {
        observer.next(new CreateThread(UUID.v4(), threadAggregate.id, "test"));
        observer.next(new UpdateThreadName(UUID.v4(), threadAggregate.id, "test"));
        observer.complete();
      });

      observable.subscribe((msg: CommandRequest) => {
        threadAggregate.receive(msg);
      });

    })
  }
);



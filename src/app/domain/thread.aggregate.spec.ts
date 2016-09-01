import * as Rx from '@reactivex/rxjs';
import 'rxjs/add/operator/map';
import * as UUID from 'node-uuid';

import {
  ThreadAggregate,
  CommandRequest,
  CreateThread,
  Event,
  UpdateThreadName,
  ThreadCreated,
  ThreadNameUpdated
} from './thread.aggregate';

describe('ThreadAggregate', () => {
    it('send commands', () => {
      let subscriber = Rx.Subscriber.create((msg: Event) => {
        if (msg instanceof ThreadCreated) {
          expect((msg as ThreadCreated).name).toBe('test');
        } else if (msg instanceof  ThreadNameUpdated) {
          expect((msg as ThreadNameUpdated).name).toBe('test');
        } else {
          fail('invalid message');
        }
        console.log(msg);
      });

      let threadAggregate = new ThreadAggregate(UUID.v4(), subscriber);

      let observable = Rx.Observable.create((observer: Rx.Observer<CommandRequest>) => {
        observer.next(new CreateThread(UUID.v4(), threadAggregate.id, 'test'));
        observer.next(new UpdateThreadName(UUID.v4(), threadAggregate.id, 'test'));
        observer.complete();
      });

      observable.subscribe((msg: CommandRequest) => {
        threadAggregate.receive(msg);
      });

    });
  }
);



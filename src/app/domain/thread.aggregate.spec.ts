import {Observable, Observer, Subject} from "rxjs";
import 'rxjs/add/operator/map';
import {UUID} from "uuid";

import {ThreadAggregate, CommandRequest, CreateThread, Event} from './thread.aggregate';

describe('Thread', () => {
    it('send msg', () => {
      let subject = new Subject().subscribe((msg) => {
        console.log(msg);
      });
      let threadAr = new ThreadAggregate(subject, UUID.generateId());

      Observable.create((observer: Observer<CommandRequest>) => {
        observer.next(new CreateThread(UUID.generate(), "test"));
      }).subscribe((msg) => {
        threadAr.receive(msg);
      })

    })
  }
)


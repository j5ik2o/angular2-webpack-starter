import {Observable, Observer} from "rxjs";
import 'rxjs/add/operator/map';
import {UUID} from "uuid";

namespace domain {
  describe('Thread', () => {
      it('send msg', () => {
        let subject = new Subject().subscribe((msg) => {
          console.log(msg);
        });
        let threadAr = new ThreadAggregate(subject, UUID.generateId());

        Observable.create((observer: Observer<protocol.CommandRequest>) => {
          observer.next(new protocol.CreateThread(UUID.generate(), "test"));
        }).subscribe((msg) => {
          threadAr.receive(msg);
        })

      })
    }
  )

}

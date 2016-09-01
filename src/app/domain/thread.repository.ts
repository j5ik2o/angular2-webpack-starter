import { ThreadAggregate } from './thread.aggregate';
import * as monapt from '../../../typings/dist/monapt';

export default class ThreadRepository {

  private aggreates: {[id: string]: ThreadAggregate; } = {};

  store(aggregate: ThreadAggregate): void {
    this.aggreates[aggregate.id] = aggregate;
  }

  resolveBy(id: string): monapt.Try<ThreadAggregate> {
    return monapt.Try(() => {
      return this.aggreates[id];
    });
  }

  deleteBy(id: string): monapt.Try<void> {
    return monapt.Try(() => {
      delete this.aggreates[id];
    });
  }

}

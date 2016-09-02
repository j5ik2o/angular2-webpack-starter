import { ThreadAggregate } from './thread.aggregate';

export default class ThreadRepository {

  private _aggreates: { [key: string]: ThreadAggregate; } = {};

  constructor() {
  }

  store(aggregate: ThreadAggregate): void {
    this._aggreates[aggregate.id] = aggregate;
  }

  resolveBy(id: string): ThreadAggregate {
    return this._aggreates[id];
  }

  resolveAll(): ThreadAggregate[] {
    const result: ThreadAggregate[] = [];
    for (const key in this._aggreates) {
      result.push(this._aggreates[key]);
    }
    console.log(result);
    return result;
  }

  deleteBy(id: string): void {
    delete this._aggreates[id];
  }

}

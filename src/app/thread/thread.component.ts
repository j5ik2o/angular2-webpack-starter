import { Component, OnInit } from '@angular/core';
import ThreadActions, { IAppState } from './thread.actions';
import * as Rx from 'rxjs';
import { NgRedux } from 'ng2-redux';
import { AsyncPipe } from '@angular/common';
import { ThreadAggregate } from '../domain/thread.aggregate';
import * as UUID from 'node-uuid';

@Component({
  selector: 'thread',
  providers: [ThreadActions, AsyncPipe],
  template: `<span>aaaa</span>
 <ul>
    <li *ngFor="let threadAggregate of threadAggregates$ | async">
    {{threadAggregate.getThread().name}}
    </li>
  </ul>
<span>bbbb</span>
  `
})
export default class ThreadComponent implements OnInit {

  threadAggregates$: Rx.Observable<ThreadAggregate[]>;

  constructor(private ngRedux: NgRedux<IAppState>, private threadActions: ThreadActions) {
  }

  ngOnInit() {
    this.threadAggregates$ = this.ngRedux.select(state => state.threadRepository.resolveAll());
    this.threadActions.createThread(UUID.v4(), 'test-1');
    this.threadActions.getThreads();
  }

}

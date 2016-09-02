import { Component, OnInit } from '@angular/core';
import ThreadActions, { IAppState } from './thread.actions';
import * as Rx from 'rxjs';
import { NgRedux } from 'ng2-redux';
import { AsyncPipe } from '@angular/common';
import { ThreadAggregate } from './domain/thread.aggregate';
import * as UUID from 'node-uuid';

@Component({
  selector: 'thread',
  providers: [ThreadActions, AsyncPipe],
  template: `
<table class="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Thread Name</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let threadAggregate of threadAggregates$ | async; let idx = index">
      <th scope="row">{{idx + 1}}</th>
      <td>{{threadAggregate.getThread().name}}</td>
    </tr>
  </tbody>
</table>
  `
})
export default class ThreadComponent implements OnInit {

  threadAggregates$: Rx.Observable<ThreadAggregate[]>;

  constructor(private ngRedux: NgRedux<IAppState>, private threadActions: ThreadActions) {
  }

  ngOnInit() {
    this.threadAggregates$ = this.ngRedux.select(state => state.threadRepository.resolveAll());
    this.threadActions.createThread(UUID.v4(), 'test-1');
    this.threadActions.createThread(UUID.v4(), 'test-2');
    this.threadActions.createThread(UUID.v4(), 'test-3');
    this.threadActions.getThreads();
  }

}

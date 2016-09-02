import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { threadRepositoryReducer } from './thread.reducer';
import { combineReducers } from 'redux';
import ThreadRepository from '../domain/thread.repository';
import { CreateThread } from '../domain/thread.aggregate';
import { ThreadActionTypes } from './thread.action.type';
const persistState = require('redux-localstorage');
import * as UUID from 'node-uuid';

export interface IAppState {
  threadRepository?: ThreadRepository;
}

export const rootReducer = combineReducers<IAppState>({
  threadRepository: threadRepositoryReducer
});

export const enhancers = [
  persistState('threadRepository', {key: 'example/threads'})
];

@Injectable()
export default class ThreadActions {
  constructor(private ngRedux: NgRedux<IAppState>) {
  }

  createThread(aggregateId: string, name: string): void {
    console.log('createThread - start');
    this.ngRedux.dispatch({
      type: ThreadActionTypes.CREATE_THREAD,
      value: new CreateThread(UUID.v4(), aggregateId, name)
    });
    console.log('createThread - finish');
  }

  getThreads(): void {
    console.log('getThreads - start');
    this.ngRedux.dispatch({type: ThreadActionTypes.GET_THREADS});
    console.log('getThreads - finish');
  }

}

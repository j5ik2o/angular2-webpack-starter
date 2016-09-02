import ThreadRepository from '../domain/thread.repository';
import { ThreadAggregate, CreateThread } from '../domain/thread.aggregate';
import { ThreadActionTypes } from './thread.action.type';

export function threadRepositoryReducer(state: ThreadRepository = new ThreadRepository(),
                                        action): ThreadRepository {
  console.log('threadRepositoryReducer -- start');
  switch (action.type) {
    case ThreadActionTypes.CREATE_THREAD:
      const cmd = action.value as CreateThread;
      const ar = new ThreadAggregate(cmd.entityId);
      ar.create(cmd);
      state.store(ar);
      console.log('threadRepositoryReducer -- finish');
      return state;
    default:
      console.log('threadRepositoryReducer -- finish');
      return state;
  }
}

import ThreadRepository from './domain/thread.repository';
import { ThreadAggregate, CreateThread, UpdateThreadName } from './domain/thread.aggregate';
import { ThreadActionTypes } from './thread.action.type';

export function threadRepositoryReducer(state: ThreadRepository = new ThreadRepository(),
                                        action): ThreadRepository {
  console.log('threadRepositoryReducer -- start');
  let newState: ThreadRepository = null;
  switch (action.type) {
    case ThreadActionTypes.CREATE_THREAD: {
      const cmd = action.value as CreateThread;
      const ar = new ThreadAggregate(cmd.entityId);
      ar.create(cmd);
      state.store(ar);
      newState = state;
    }
      break;
    case ThreadActionTypes.UPDATE_THREAD_NAME: {
      const cmd = action.value as UpdateThreadName;
      const ar = state.resolveBy(cmd.entityId);
      ar.updateName(cmd);
      state.store(ar);
      newState = state;
    }
      break;
    default:
      newState = state;
  }
  console.log('threadRepositoryReducer -- finish');
  return newState;
}

import * as Rx from '@reactivex/rxjs'
import UUID = require('uuid');
import Thread from './thread';

export interface Event {
  id: string
}

export class ThreadCreated implements Event {
  constructor(public id: string, public name: string) {
  }
}

export class ThreadNameUpdated implements Event {
  constructor(public id: string, public name: string) {

  }
}

export interface CommandRequest {
  id: string
  entityId: string
}

export interface CommandResponse {
  id: string
  requestId: string
}

export class CreateThread implements CommandRequest {
  constructor(public id: string, public entityId: string, public name: string) {
  }
}

export class CreateThreadSucceeded implements CommandResponse {
  constructor(public id: string, public requestId: string, public entityId: string, public name: string) {

  }
}

export class UpdateThreadName implements CommandRequest {
  constructor(public id: string, public entityId: string, public name: string) {

  }
}

export interface UpdateThreadResponse extends CommandResponse {
}

export class UpdateThreadNameSucceeded implements UpdateThreadResponse {
  constructor(public id: string, public requestId: string, public entityId: string, public name: string) {

  }
}


export class ThreadAggregate {

  state: Thread;

  constructor(private observer: Rx.Observer<Event>, public id: string) {
  }

  receive(msg: CommandRequest): CommandResponse {
    if (msg instanceof CreateThread) {
      return this.create(msg as CreateThread);
    } else if (msg instanceof UpdateThreadName) {
      return this.updateName(msg as UpdateThreadName);
    }
  }

  private create(commandRequest: CreateThread): CreateThreadSucceeded {
    if (commandRequest.entityId != this.id) {
      throw new Error;
    }
    this.state = new Thread(commandRequest.entityId, commandRequest.name);
    this.observer.next(new ThreadCreated(commandRequest.entityId, commandRequest.name));
    return new CreateThreadSucceeded(UUID.v4(), commandRequest.id, this.id, commandRequest.name);
  }

  private updateName(commandRequest: UpdateThreadName): UpdateThreadNameSucceeded {
    this.state.name = commandRequest.name;
    this.observer.next(new ThreadNameUpdated(this.id, commandRequest.name));
    return new UpdateThreadNameSucceeded(UUID.v4(), commandRequest.id, this.id, commandRequest.name)
  }

}



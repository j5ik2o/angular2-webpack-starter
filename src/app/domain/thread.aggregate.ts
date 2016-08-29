import {Observer} from "rxjs";
import {UUID} from "uuid";
import match = require("core-js/fn/symbol/match");
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
  constructor(public id: string, public requestId: string) {

  }
}

export class UpdateThreadName implements CommandRequest {
  constructor(public id: string, public entityId: string, public name: string) {

  }
}

export interface UpdateThreadResponse extends CommandResponse {
}

export class UpdateThreadNameSucceeded implements UpdateThreadResponse {
  constructor(public id: string, public requestId: string, public name: string) {

  }
}


export default class ThreadAggregate {

  state: Thread;

  constructor(private observer: Observer, public id: string) {
  }

  receive(msg: CommandRequest): CommandResponse {
    return match(msg,
      (msg: CreateThread) => this.create(msg),
      (msg: UpdateThreadName) => this.updateName(msg)
    )
  }

  private create(commdRequest: CreateThread): CreateThreadSucceeded {
    this.state = new Thread(commdRequest.entityId, commdRequest.name);
    this.observer.next(new event.ThreadCreated(commdRequest.entityId, name));
    return new CreateThreadSucceeded(UUID.generate(), commdRequest.id);
  }

  private updateName(commandRequest: UpdateThreadName): UpdateThreadResponse {
    this.state.name = commandRequest.name;
    this.observer.next(new event.ThreadNameUpdated(this.id, name));
    return new UpdateThreadNameSucceeded(UUID.generate(), commandRequest.name, commandRequest.name)
  }

}



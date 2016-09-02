import * as Rx from 'rxjs';
import * as UUID from 'node-uuid';
import Thread from './thread';
import Message from './message';

export interface Event {
  id: string;
}

export class ThreadCreated implements Event {
  constructor(public id: string, public name: string) {
  }
}

export class ThreadNameUpdated implements Event {
  constructor(public id: string, public name: string) {

  }
}

export class MessageAdded implements Event {
  constructor(public id: string, public message: string) {
  }
}

export interface CommandRequest {
  id: string;
  entityId: string;
}

export interface CommandResponse {
  id: string;
  requestId: string;
}

export class CreateThread implements CommandRequest {
  constructor(public id: string, public entityId: string, public name: string) {
  }
}

export class CreateThreadSucceeded implements CommandResponse {
  constructor(public id: string,
              public requestId: string,
              public entityId: string,
              public name: string) {

  }
}

export class UpdateThreadName implements CommandRequest {
  constructor(public id: string, public entityId: string, public name: string) {

  }
}

export interface UpdateThreadResponse extends CommandResponse {
}

export class UpdateThreadNameSucceeded implements UpdateThreadResponse {
  constructor(public id: string,
              public requestId: string,
              public entityId: string,
              public name: string) {

  }
}

export class AddMessage implements CommandRequest {
  constructor(public id: string, public entityId: string, public value: string) {
  }
}

export interface AddMessageResponse extends CommandResponse {
}

export class AddMessageSucceeded implements AddMessageResponse {
  constructor(public id: string,
              public requestId: string,
              public entityId: string,
              public value: string) {
  }
}


export class ThreadAggregate {

  private _thread: Thread;
  private _messages: Message[];
  private _observable: Rx.Subject<Event> = new Rx.Subject<Event>();

  constructor(public id: string, observer?: Rx.Observer<Event>) {
    if (observer) {
      this._observable.subscribe(observer);
    }
  }

  getThread(): Thread {
    return JSON.parse(JSON.stringify(this._thread));
  }

  create(commandRequest: CreateThread): CreateThreadSucceeded {
    // if (commandRequest.entityId !== this.id) {
    //   throw new Error;
    // }
    this._thread = new Thread(commandRequest.entityId, commandRequest.name);
    this._observable.next(new ThreadCreated(commandRequest.entityId, commandRequest.name));
    return new CreateThreadSucceeded(
      UUID.v4(),
      commandRequest.id,
      this.id,
      commandRequest.name
    );
  }

  updateName(commandRequest: UpdateThreadName): UpdateThreadNameSucceeded {
    this._thread.name = commandRequest.name;
    this.observable.next(new ThreadNameUpdated(this.id, commandRequest.name));
    return new UpdateThreadNameSucceeded(
      UUID.v4(),
      commandRequest.id,
      this.id,
      commandRequest.name
    );
  }

  addMessage(commandRequest: AddMessage): AddMessageResponse {
    let message = new Message(UUID.v4(), commandRequest.value);
    this._messages.push(message);
    this._observable.next(new MessageAdded(UUID.v4(), commandRequest.value));
    return new AddMessageSucceeded(
      UUID.v4(),
      commandRequest.id,
      this.id,
      commandRequest.value
    );
  }

}



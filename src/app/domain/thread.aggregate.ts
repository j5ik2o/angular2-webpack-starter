import * as Rx from '@reactivex/rxjs';
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

  private thread: Thread;
  private messages: Message[];
  private observable: Rx.Subject<Event>  = new Rx.Subject<Event>();

  constructor(public id: string, observer?: Rx.Observer<Event>) {
    if (observer) {
      this.observable.subscribe(observer);
    }
  }

  receive(msg: CommandRequest): void {
    if (msg instanceof CreateThread) {
      this.create(msg as CreateThread);
    } else if (msg instanceof UpdateThreadName) {
       this.updateName(msg as UpdateThreadName);
    } else if (msg instanceof AddMessage) {
      this.addMeessage(msg as AddMessage);
    }
  }

  private create(commandRequest: CreateThread): CreateThreadSucceeded {
    if (commandRequest.entityId !== this.id) {
      throw new Error;
    }
    this.thread = new Thread(commandRequest.entityId, commandRequest.name);
    this.observable.next(new ThreadCreated(commandRequest.entityId, commandRequest.name));
    return new CreateThreadSucceeded(UUID.v4(), commandRequest.id, this.id, commandRequest.name);
  }

  private updateName(commandRequest: UpdateThreadName): UpdateThreadNameSucceeded {
    this.thread.name = commandRequest.name;
    this.observable.next(new ThreadNameUpdated(this.id, commandRequest.name));
    return new UpdateThreadNameSucceeded(UUID.v4(), commandRequest.id, this.id, commandRequest.name);
  }

  private addMeessage(commandRequest: AddMessage): AddMessageResponse {
    let message = new Message(UUID.v4(), commandRequest.value);
    this.messages.push(message);
    this.observable.next(new MessageAdded(UUID.v4(), commandRequest.value));
    return new AddMessageSucceeded(UUID.v4(), commandRequest.id, this.id, commandRequest.value);
  }

}



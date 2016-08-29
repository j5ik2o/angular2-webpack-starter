import {Subscriber} from "rxjs";
import {UUID} from "uuid";
import match = require("core-js/fn/symbol/match");

namespace domain {

  namespace event {

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
  }

  namespace protocol {

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

    export interface UpdateThreadResponse extends CommandResponse {}

    export class UpdateThreadNameSucceeded implements UpdateThreadResponse {
      constructor(public id: string, public requestId: string, public name: string){

      }
    }

  }

  export class ThreadAggregate {

    state: Thread;

    constructor(private observer: Observer, public id: string) {
    }

    receive(msg: protocol.CommandRequest): protocol.CommandResponse {
      return match(msg,
        (msg: protocol.CreateThread) => this.create(msg),
        (msg: protocol.UpdateThreadName) => this.updateName(msg)
      )
    }

    private create(commdRequest: protocol.CreateThread): protocol.CreateThreadSucceeded {
      this.state = new Thread(commdRequest.entityId, commdRequest.name);
      this.observer.next(new event.ThreadCreated(commdRequest.entityId, name));
      return new protocol.CreateThreadSucceeded(UUID.generate(), commdRequest.id);
    }

    private updateName(commandRequest: protocol.UpdateThreadName): protocol.UpdateThreadResponse {
      this.state.name = commandRequest.name;
      this.observer.next(new event.ThreadNameUpdated(this.id, name));
      return new protocol.UpdateThreadNameSucceeded(UUID.generate(), commandRequest.name, commandRequest.name)
    }


  }

}

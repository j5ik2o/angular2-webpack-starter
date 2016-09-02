/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from './thread/thread.actions';
import { ThreadAggregate, CreateThread } from './thread/domain/thread.aggregate';
import * as UUID from 'node-uuid' ;
import Thread from './thread/domain/thread';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
    </nav>

    <main>
      <router-outlet>
      </router-outlet>
    </main>

    <footer>
      <span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularclassLogo" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public ngRedux: NgRedux<IAppState>) {

  }

  ngOnInit() {
 //   console.log('Initial App State', this.ngRedux.getState().getRepository());

  }

}

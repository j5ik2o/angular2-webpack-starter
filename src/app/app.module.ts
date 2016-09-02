import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { Alert } from './alert';
import { DatePicker } from './datepicker';
import { Ng2BootstrapModule } from 'ng2-bootstrap-rc5-unofficial/components';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
import { IAppState, rootReducer, enhancers } from './thread/thread.actions';
import ThreadComponent from './thread/thread.component';
const createLogger = require('redux-logger');
const persistState = require('redux-localstorage');

/*
 * Platform and Environment providers/directives/pipes
 */
// App is our top level component

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App,
    Alert,
    DatePicker,
    ThreadComponent
  ],
  imports: [ // import Angular's modules
    Ng2BootstrapModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: true})
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {

  constructor(public appRef: ApplicationRef, private ngRedux: NgRedux<IAppState>) {
    this.ngRedux.configureStore(
      rootReducer,
      {},
      [createLogger()],);
//      [...enhancers, devTool.isEnabled() ? devTool.enhancer() : f => f]);
  }

  hmrOnInit(store) {
    if (!store || !store.state)
      return;
    console.log('HMR store', store);
    this.ngRedux.getState().threadRepository = store.state;
    this.appRef.tick();
    delete store.state;
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    const state = this.ngRedux.getState().threadRepository;
    store.state = state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}

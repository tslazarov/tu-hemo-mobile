import { EventData } from "data/observable";
import { Page } from "ui/page";
import { BottomNavigation, BottomNavigationTab, OnTabSelectedEventData } from "nativescript-bottom-navigation";
import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { Frame, topmost, getFrameById  } from "tns-core-modules/ui/frame";

import { HomeViewModel } from "./home-view-model";

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new HomeViewModel();
}

export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
  }
   
  export function bottomNavigationLoaded(args) {
    let bottomNavigation: BottomNavigation = args.object;
    bottomNavigation.on('tabSelected', tabSelected);
   
  }
   
  export function tabSelected(args: OnTabSelectedEventData) {
    console.log('tab selected ' + args.newIndex);
    var frame = getFrameById("contentFrame");

    let navigationEntry = {
      moduleName: "login/login-page",
      clearHistory: true
    };

    frame.navigate(navigationEntry);
  }

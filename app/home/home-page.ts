import { EventData } from "data/observable";
import { Page } from "ui/page";
import { BottomNavigation, BottomNavigationTab, OnTabSelectedEventData } from "nativescript-bottom-navigation";
import { Frame, topmost, getFrameById  } from "tns-core-modules/ui/frame";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HomeViewModel();
}

export function pageLoaded(args: EventData) {
    let page = <Page>args.object;
}
   
export function bottomNavigationLoaded(args) {
  let bottomNavigation: BottomNavigation = args.object;
  bottomNavigation.on('tabSelected', tabSelected);
   
}
   
export function tabSelected(args: OnTabSelectedEventData) {
  let navigationEntry: any;
  let frame = getFrameById("contentFrame");
  
  switch(args.newIndex) {
    case 0: {
      navigationEntry = {
        moduleName: "search/search-page",
        clearHistory: true
      };
      break;
    }
    case 1: {
      navigationEntry = {
        moduleName: "med-centers/med-centers-page",
        clearHistory: true
      };
    }
    case 2: {
      navigationEntry = {
        moduleName: "request/request-page",
        clearHistory: true
      };
      break;
    }
    case 3: {
      navigationEntry = {
        moduleName: "profile/profile-page",
        clearHistory: true
      };
    }
  }

  frame.navigate(navigationEntry);
}

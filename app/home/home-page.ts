import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { BottomNavigation, BottomNavigationTab, OnTabSelectedEventData } from "nativescript-bottom-navigation";
import { Frame, topmost, getFrameById  } from "tns-core-modules/ui/frame/frame";

import { HomeViewModel } from "./home-view-model";

export function onNavigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HomeViewModel();
}
   
export function bottomNavigationLoaded(args) {
  let bottomNavigation: BottomNavigation = args.object;
  bottomNavigation.on('tabSelected', tabSelected);
   
}
   
export function tabSelected(args: OnTabSelectedEventData) {
  let navigationEntry: any;
  let frame = getFrameById("contentFrame");
  
  if(args.newIndex > args.oldIndex){
    frame.transition = { name:  "slideLeft" };
  }
  else{
    frame.transition = { name:  "slideRight" };
  }

  switch(args.newIndex) {
    case 0: {

      navigationEntry = {
        moduleName: "search/search-page",
        clearHistory: true,
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
      break;
    }
    case 4: {
      navigationEntry = {
        moduleName: "settings/settings-page",
        clearHistory: true
      };
      break;
    }
  }

  frame.navigate(navigationEntry);
}

import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Frame, topmost } from "tns-core-modules/ui/frame/frame";
import { AppRootViewModel } from "./app-root-view-model";
import { SecureStorage } from "nativescript-secure-storage";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new AppRootViewModel();
}

export function pageLoaded(args: EventData) {
    let navigationEntry: any;
    let topmostFrame: Frame = topmost(); 

    if(secureStorage.getSync({key: "access_token" })) {
        navigationEntry = {
            moduleName: "home/home-page",
            clearHistory: true
        };
    }
    else {
        navigationEntry = {
            moduleName: "login/login-page",
            clearHistory: true
        };
    }

    topmostFrame.navigate(navigationEntry);
}

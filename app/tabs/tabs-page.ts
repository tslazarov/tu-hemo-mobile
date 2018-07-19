import { SelectedIndexChangedEventData, TabView, TabViewItem } from "tns-core-modules/ui/tab-view";
import { NavigatedData, Page } from "ui/page";
import { Frame, topmost } from "tns-core-modules/ui/frame";
import { TabsViewModel } from "./tabs-view-model";
import { SecureStorage } from "nativescript-secure-storage";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: NavigatedData) {

    if(!secureStorage.getSync({key: "access_token" })) {
        let topmostFrame: Frame = topmost(); 

        let navigationEntry = {
            moduleName: "login/login-page",
            clearHistory: true
        };

        topmostFrame.navigate(navigationEntry);
    }

    const page = <Page>args.object;
    page.bindingContext = new TabsViewModel();
}

/* ***********************************************************
* Get the current tab view title and set it as an ActionBar title.
* Learn more about the onSelectedIndexChanged event here:
* https://docs.nativescript.org/cookbook/ui/tab-view#using-selectedindexchanged-event-from-xml
*************************************************************/
export function onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
    const tabView = <TabView>args.object;
    const bindingContext = <TabsViewModel>tabView.bindingContext;
    const selectedTabViewItem = tabView.items[args.newIndex];

    bindingContext.title = selectedTabViewItem.title;
}

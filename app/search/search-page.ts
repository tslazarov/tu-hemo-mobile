import { EventData } from "data/observable";
import { Page } from "ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost  } from "tns-core-modules/ui/frame";


import { SearchViewModel } from "./search-view-model";
import { AutoCompleteEventData } from "nativescript-ui-autocomplete";

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SearchViewModel(args);
}

export function pageLoaded(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SearchViewModel(args);
}

export function onOpenDrawerTap() {
    let sideDrawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("sideDrawer"));
    sideDrawer.showDrawer();
}

export function onCloseDrawerTap() {
    let sideDrawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("sideDrawer"));
    sideDrawer.closeDrawer();
}

export function onTextChanged(args: AutoCompleteEventData) {
    console.log(args.text);
}

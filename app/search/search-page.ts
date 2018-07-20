import { EventData } from "data/observable";
import { Page } from "ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost  } from "tns-core-modules/ui/frame";

import { SearchViewModel } from "./search-view-model";

import { ThirdPartyCredentials } from "../constants/third-party-credentials"

let googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);

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

import { EventData } from "data/observable";
import { Page } from "ui/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost  } from "tns-core-modules/ui/frame";
import { SegmentedBar, SegmentedBarItem } from "ui/segmented-bar";

import { SearchViewModel } from "./search-view-model";

import { ThirdPartyCredentials } from "../constants/third-party-credentials"

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SearchViewModel(args);

    page.bindingContext.visibility1 = true;
    page.bindingContext.visibility2 = false;
    page.bindingContext.selectedBarIndex = 0;
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

export function onSbLoaded(args) {

    const segmentedBarComponent = args.object;
    segmentedBarComponent.on("selectedIndexChange", (sbargs) => {
        let segmentedBar = <SegmentedBar>sbargs.object;
        this.selectedIndex = segmentedBar.selectedIndex;
        console.log('swipe');
        let viewModel = <SearchViewModel>segmentedBar.page.bindingContext;

        switch (this.selectedIndex) {
            case 0:
                viewModel.visibility1 = true;
                viewModel.visibility2 = false;
                break;
            case 1:
                viewModel.visibility1 = false;
                viewModel.visibility2 = true;
                break;
            default:
                break;
        }
    })
}

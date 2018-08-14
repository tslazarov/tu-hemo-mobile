import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";

import { SearchDetailViewModel } from "./search-detail-view-model";

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./search/search-detail/search-detail-page.css");

    page.bindingContext = new SearchDetailViewModel();

    if(typeof context != 'undefined' && context) {
            page.bindingContext.id = context.id;
    }

    // call API to load full detail page
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <SearchDetailViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "search/search-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

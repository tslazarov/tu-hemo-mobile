import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Button } from "tns-core-modules/ui/button/button";
import { RequestViewModel } from "./request-view-model";
import { topmost } from "tns-core-modules/ui/frame/frame";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new RequestViewModel();
}

export function onFabCreateTap(args: EventData) {
    const button = <Button>args.object;
    const viewModel = <RequestViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-create/request-create-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

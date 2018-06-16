import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";

import { RequestViewModel } from "./request-view-model";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = new RequestViewModel();
}

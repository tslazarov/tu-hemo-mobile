import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";

import { SearchListViewModel } from "./search-list-view-model";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = new SearchListViewModel();
}
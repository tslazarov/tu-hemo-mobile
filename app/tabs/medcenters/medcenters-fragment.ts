import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";

import { MedCentersViewModel } from "./medcenters-view-model";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
    component.bindingContext = new MedCentersViewModel();
}

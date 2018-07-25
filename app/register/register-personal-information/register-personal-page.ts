import { EventData } from "data/observable";
import { Button } from "ui/button";
import { Page } from "ui/page";

import { RegisterPersonalViewModel } from "./register-personal-view-model";

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    console.log(context);

    page.bindingContext = new RegisterPersonalViewModel();
}

export function onRegisterTap(args: EventData): void { 
    console.log("tap");
}
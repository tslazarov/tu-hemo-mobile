import { EventData } from "data/observable";
import { Button } from "ui/button";
import { Label } from "ui/label";
import { Page } from "ui/page";

import { RegisterPersonalViewModel } from "./register-personal-view-model";

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    page.addCssFile("./register/register-personal-information/register-personal-information.css");
    const context: any = page.navigationContext;

    console.log(context);

    page.bindingContext = new RegisterPersonalViewModel();
}

export function onRegisterTap(args: EventData): void { 
    console.log("tap");
}

export function onBloodTypeTap(args: EventData): void {
    const label = <Label>args.object;
    const wrapLayout = label.parent;
    for(var i = 1; i <= 8; i += 1){
        var childLabel = wrapLayout.getViewById(`option-${i}`);
        childLabel.className = "blood-type-button";
    }
    label.className = "blood-type-button selected";

    var myRegexp = /(.*)-([0-9]{1})/;
    var match = myRegexp.exec(label.id);
    
    var selectedValue = match[2];
}
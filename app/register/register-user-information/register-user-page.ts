import { EventData } from "data/observable";
import { Button } from "ui/button";
import { Page } from "ui/page";
import { Frame, topmost } from "tns-core-modules/ui/frame";

import { RegisterUserViewModel } from "./register-user-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterUserViewModel();
}

export function onNextTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RegisterUserViewModel>button.bindingContext;

    console.log("tap");

    let topmostFrame: Frame = topmost(); 

    const navigationEntry = {
        moduleName: "register/register-personal-information/register-personal-page",
        context: { 
            "email": viewModel.email, 
            "password": viewModel.password,
            "confirmPassword": viewModel.confirmPassword,
            "isExternalLogin": false },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}
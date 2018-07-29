import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { ForgotPasswordSecondaryViewModel } from "./forgot-password-secondary-view-model";


export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./forgot-password/initial/forgot-password-initial.css");

    console.log('here');

    page.bindingContext = new ForgotPasswordSecondaryViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.email = context.email;
    }
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ForgotPasswordSecondaryViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "forgot-password/initial/forgot-password-initial-page",
        context: { 
            "email": viewModel.email 
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onChangeTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ForgotPasswordSecondaryViewModel>button.bindingContext;

    if(!viewModel.validateEmptyResetCodeAndPassword() || !viewModel.validateFields()){
        return;
    }

    console.log("changed");
}

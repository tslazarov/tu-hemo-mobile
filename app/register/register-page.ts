import { EventData } from "data/observable";
import { Button } from "ui/button";
import { Page } from "ui/page";

import { RegisterViewModel } from "./register-view-model";

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new RegisterViewModel();
}

function onSignupWithSocialProviderButtonTap() {
    /* ***********************************************************
    * For sign up with social provider you can add your custom logic or
    * use NativeScript plugin for sign up with Facebook
    * http://market.nativescript.org/plugins/nativescript-facebook
    *************************************************************/
}

export function onSignupButtonTap(args: EventData) {
    const button = <Button>args.object;
    const bindingContext = <RegisterViewModel>button.bindingContext;

    bindingContext.signUp();
}

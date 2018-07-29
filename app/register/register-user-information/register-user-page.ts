import { EventData } from "data/observable";
import { Button } from "ui/button";
import { Page } from "ui/page";
import { topmost } from "tns-core-modules/ui/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { TranslationService } from "../../utilities/translation-service";
import { Color } from "tns-core-modules/color";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";

import { RegisterUserViewModel } from "./register-user-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./register/register-user-information/register-user-information.css");
    page.bindingContext = new RegisterUserViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.email = context.email;
        page.bindingContext.password = context.password;
        page.bindingContext.confirmPassword = context.password;
    }

    console.log(context);
}

export function onNextTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RegisterUserViewModel>button.bindingContext;

    if(!viewModel.validateEmptyEmailOrPassword() || !viewModel.validateFields()){
        return;
    }

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.UsersExistEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "email": viewModel.email });

    HttpClient.putRequest(url, content, null, contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(result) {
            message = TranslationService.localizeValue("alreadyExistingEmail", "register-page", "message");

            viewModel.feedback.show({
                message: message,
                messageColor: new Color("#FFFFFF"),
                messageSize: 16,
                position: FeedbackPosition.Top,
                type: FeedbackType.Error,
                duration: 3000,
                backgroundColor: new Color("#C91C1C"),
                onTap: () => { this.feedback.hide() }
            });
        }
        else {
            const navigationEntry = {
                moduleName: "register/register-personal-information/register-personal-page",
                context: { 
                    "email": viewModel.email, 
                    "password": viewModel.password,
                    "isExternalLogin": false },
                clearHistory: true
            };
        
            topmost().navigate(navigationEntry);
        }
    }, (reject) => {
    });
}
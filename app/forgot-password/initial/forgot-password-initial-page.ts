import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { TranslationService } from "../../utilities/translation-service";
import { Color } from "tns-core-modules/color/color";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";

import { ForgotPasswordInitialViewModel } from "./forgot-password-initial-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./forgot-password/initial/forgot-password-initial.css");

    page.bindingContext = new ForgotPasswordInitialViewModel();
    
    if(typeof context != 'undefined' && context) {
        page.bindingContext.email = context.email;
    }
}

export function onNextTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ForgotPasswordInitialViewModel>button.bindingContext;

    if(!viewModel.validateEmptyEmail()){
        return;
    }

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.UsersExistEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "email": viewModel.email });

    HttpClient.putRequest(url, content, null, contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(!result) {
            message = TranslationService.localizeValue("nonExistingEmail", "forgot-password-page", "message");

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
                moduleName: "forgot-password/secondary/forgot-password-secondary-page",
                context: { 
                    "email": viewModel.email },
                clearHistory: true
            };
        
            topmost().navigate(navigationEntry);
        }
    }, (reject) => {
    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ForgotPasswordInitialViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "login/login-page",
        context: { 
            "email": viewModel.email 
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}
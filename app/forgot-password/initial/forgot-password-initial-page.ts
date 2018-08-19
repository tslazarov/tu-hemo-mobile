import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Button } from "tns-core-modules/ui/button/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { APIConstants } from "../../constants/api-endpoints";
import { TranslationService } from "../../utilities/translation-service";
import { Color } from "tns-core-modules/color/color";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { MessageService } from "../../utilities/message-service"

import { ForgotPasswordInitialViewModel } from "./forgot-password-initial-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./forgot-password/initial/forgot-password-initial-page.css");

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
    
    let url = `${APIConstants.Domain}/${APIConstants.UsersSendResetCodeEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "email": viewModel.email, "language": secureStorage.getSync({key: "language" }) });

    HttpClient.putRequest(url, content, null, contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(!result) {
            message = TranslationService.localizeValue("nonExistingEmail", "forgot-password-page", "message");

            MessageService.showError(message, viewModel.feedback);
        }
        else {
            if(result.hasOwnProperty("resetCode")){
                message = TranslationService.localizeValue("sendResetCode", "forgot-password-page", "message");

                MessageService.showSuccess(message, viewModel.feedback);

                const navigationEntry = {
                    moduleName: "forgot-password/secondary/forgot-password-secondary-page",
                    context: { 
                        "email": viewModel.email,
                        "resetCode": result["resetCode"] },
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {
    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ForgotPasswordInitialViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "login/login-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}
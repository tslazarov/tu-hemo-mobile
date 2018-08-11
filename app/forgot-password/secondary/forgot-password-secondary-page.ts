import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { TranslationService } from "../../utilities/translation-service";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

import { ForgotPasswordSecondaryViewModel } from "./forgot-password-secondary-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./forgot-password/initial/forgot-password-initial.css");

    console.log('here');

    page.bindingContext = new ForgotPasswordSecondaryViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.email = context.email;
        page.bindingContext.correctResetCode = context.resetCode;
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

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.UsersResetPasswordEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "email": viewModel.email, "newPassword": viewModel.password, "resetCode": viewModel.resetCode });

    HttpClient.putRequest(url, content, null, contentType)
    .then((response) => {
        const result = response.content.toJSON();
        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")){
            if(result["isSuccessful"]) {
                message = TranslationService.localizeValue("passwordReset", "forgot-password-page", "message");
    
                viewModel.feedback.show({
                    message: message,
                    messageColor: new Color("#FFFFFF"),
                    messageSize: 16,
                    position: FeedbackPosition.Top,
                    type: FeedbackType.Success,
                    duration: 3000,
                    onTap: () => { this.feedback.hide() }
                });
    
                const navigationEntry = {
                    moduleName: "login/login-page",
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
            else if(result.hasOwnProperty("state")) {

                if(result["state"] == "incorrect_reset_code") {               
                    message = TranslationService.localizeValue("invalidResetCode", "forgot-password-page", "message");
                }

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
        }
    }, (reject) => {
    });
}

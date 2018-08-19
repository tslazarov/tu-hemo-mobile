import { EventData } from "tns-core-modules/data/observable/observable";
import { Button } from "tns-core-modules/ui/button/button";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { TranslationService } from "../../utilities/translation-service";
import { MessageService } from "../../utilities/message-service"

import { RegisterUserViewModel } from "./register-user-information-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./register/register-user-information/register-user-information-page.css");
    page.bindingContext = new RegisterUserViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.email = context.email;
        page.bindingContext.password = context.password;
        page.bindingContext.confirmPassword = context.password;
    }
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

            MessageService.showError(message, viewModel.feedback);
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
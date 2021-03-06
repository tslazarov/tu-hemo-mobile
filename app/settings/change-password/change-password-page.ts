import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { ChangePasswordViewModel } from "./change-password-view-model";
import { TranslationService } from "../../utilities/translation-service";
import { SecureStorage } from "nativescript-secure-storage";
import { MessageService } from "../../utilities/message-service"

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.addCssFile("./settings/change-password/change-password-page.css");

    page.bindingContext = new ChangePasswordViewModel();
}

export function onChangeTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ChangePasswordViewModel>button.bindingContext;

    if(!viewModel.validateEmptyPasswords() || !viewModel.validateFields()){
        return;
    }

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.SettingsChangePasswordEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "oldPassword": viewModel.oldPassword, "newPassword": viewModel.newPassword });

    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")){
            if(result["isSuccessful"]) {
                message = TranslationService.localizeValue("passwordChanged", "change-password-page", "message");
    
                MessageService.showSuccess(message, viewModel.feedback);
    
                const navigationEntry = {
                    moduleName: "settings/settings-page",
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
            else if(result.hasOwnProperty("state")) {

                if(result["state"] == "incorrect_password") {               
                    message = TranslationService.localizeValue("incorrectOldPassword", "change-password-page", "message");
                }

                MessageService.showError(message, viewModel.feedback);
            }
        }
    }, (reject) => {
    });
}

export function onBackTap(args: EventData): void { 
    const navigationEntry = {
        moduleName: "settings/settings-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { ChangeEmailViewModel } from "./change-email-view-model";
import { TranslationService } from "../../utilities/translation-service";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";
import { SecureStorage } from "nativescript-secure-storage";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.addCssFile("./settings/change-email/change-email-page.css");
    
    page.bindingContext = new ChangeEmailViewModel();
}

export function onChangeTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ChangeEmailViewModel>button.bindingContext;

    if(!viewModel.validateEmptyEmailAndPassword() || !viewModel.validateFields()) {
        return;
    }

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.ChangeEmailEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "email": viewModel.newEmail, "password": viewModel.password });
    
    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isChanged")) {

            if(result["isChanged"]) {

                let url = `${APIConstants.Domain}/${APIConstants.AuthorizeEndpoint}`;
                let contentType = 'application/x-www-form-urlencoded';
                let content = `grant_type=password&username=${viewModel.newEmail}&password=${viewModel.password}`;

                HttpClient.postRequest(url, content, null, contentType)
                    .then((response) => {
                        const result = response.content.toJSON();

                        if (response.statusCode == 200 && result.hasOwnProperty("access_token")) {
                            secureStorage.set({
                                key: "access_token",
                                value: result["access_token"]
                            }).then((resolve) => {
                                message = TranslationService.localizeValue("emailChanged", "change-email-page", "message");

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
                                    moduleName: "settings/settings-page",
                                    clearHistory: true
                                };
                            
                                topmost().navigate(navigationEntry);
                            }, (reject) => {
                                //TODO: handle access token set failure
                            });
                        }
                    }, (reject) => {
                        //TODO: handle request failure
                });
            }
            else if(result.hasOwnProperty("state")){
                if(result["state"] == "existing_mail") {

                    message = TranslationService.localizeValue("alreadyExistingEmail", "change-email-page", "message");

                } else if (result["state"] == "incorrect_password") {

                    message = TranslationService.localizeValue("incorrectPassword", "change-email-page", "message");

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

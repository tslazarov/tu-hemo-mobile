import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { TranslationService } from "../../utilities/translation-service";
import { FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";
import { SecureStorage } from "nativescript-secure-storage";
import { TNSFancyAlert } from 'nativescript-fancyalert';
import {exit} from 'nativescript-exit';
import { login as fbLogin } from "nativescript-facebook";

const secureStorage = new SecureStorage();

import { DeleteAccountViewModel } from "./delete-account-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./settings/delete-account/delete-account-page.css");

    page.bindingContext = new DeleteAccountViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.visibilityMode = context.visible;
        if(context.visible == "collapsed") {
            page.bindingContext.visibilityModeFb = "visible";
        } else {
            page.bindingContext.visibilityModeFb = "collapsed";
        }
    }
}

export function onDeleteTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <DeleteAccountViewModel>button.bindingContext;

    if(viewModel.visibilityModeFb != "visible" && !viewModel.validateEmptyPassword()){
        return;
    }

    TNSFancyAlert.showWarning(viewModel.warning, viewModel.warningMessage, viewModel.confirm)
    .then(() => {
        if(viewModel.visibilityModeFb == "visible") {
            fbLogin((err, fbData) => {
                if (err) {
                } else {
                  if(fbData.token){
                    deleteAccount(viewModel, true);
                };
                }
            })
        } else if(viewModel.visibilityModeFb == "collapsed") {
            deleteAccount(viewModel, false);
        } 
    })
}

export function onBackTap(args: EventData): void { 
    const navigationEntry = {
        moduleName: "settings/settings-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function deleteAccount(viewModel: DeleteAccountViewModel, isExternal: boolean) { 
    
    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.DeleteAccountEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "password": viewModel.password, "isExternal": isExternal });

    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
        .then((response) => {
            const result = response.content.toJSON();
            if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {

                if(result["isSuccessful"]) {
                    secureStorage.removeAll().then((success) => {
                        exit();
                    });
                }
                else if(result.hasOwnProperty("state")){
                    if (result["state"] == "incorrect_password") {
                        message = TranslationService.localizeValue("incorrectPassword", "delete-account-page", "message");
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
import { EventData } from "data/observable";
import { Button } from "ui/button";
import { NavigatedData, Page } from "ui/page";
import { LoginViewModel } from "./login-view-model";
import { Frame, topmost } from "tns-core-modules/ui/frame";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";

const httpModule = require("http");
const secureStorage = new SecureStorage();

export function onNavigatingTo(args: NavigatedData) {    
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel();
}

export function onSignInButtonTap(args: EventData): void {
    const button = <Button>args.object;
    const bindingContext = <LoginViewModel>button.bindingContext;

    let url = `${APIConstants.Domain}/${APIConstants.AuthorizeEndpoint}`;
    let contentType = 'application/x-www-form-urlencoded';
    let content = `grant_type=password&username=${bindingContext.email}&password=${bindingContext.password}`;

    HttpClient.postRequest(url, content, null, contentType)
        .then((response) => {
            const result = response.content.toJSON();

            if (response.statusCode == 400) {
                //TODO: show error in UI
            }

            if (response.statusCode == 200 && result.hasOwnProperty("access_token")) {
                secureStorage.set({
                    key: "access_token",
                    value: result["access_token"]
                  }).then((resolve) => {
                        let topmostFrame: Frame = topmost(); 

                        let navigationEntry = {
                            moduleName: "tabs/tabs-page",
                            clearHistory: true
                        };
        
                        topmostFrame.navigate(navigationEntry);
                  }, (reject) => {
                    //TODO: handle access token set failure
                });
            }
        }, (reject) => {
            //TODO: handle request failure
        });
}
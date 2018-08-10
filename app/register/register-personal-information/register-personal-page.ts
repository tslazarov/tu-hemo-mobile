import { EventData } from "tns-core-modules/data/observable/observable";
import { Button } from "tns-core-modules/ui/button/button";
import { Label } from "tns-core-modules/ui/label/label";
import { Image } from "tns-core-modules/ui/image/image";
import { Page } from "tns-core-modules/ui/page/page";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { SecureStorage } from "nativescript-secure-storage";

import { RegisterPersonalViewModel } from "./register-personal-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./register/register-personal-information/register-personal-information.css");

    page.bindingContext = new RegisterPersonalViewModel();

    if(typeof context != 'undefined' && context) {
        if(context.isExternalLogin != 'undefined' && context.isExternalLogin) {
            page.bindingContext.email = context.email;
            page.bindingContext.password = "";
            page.bindingContext.firstName = context.firstName;
            page.bindingContext.lastName = context.lastName;
            page.bindingContext.userExternalId = context.userExternalId;
            page.bindingContext.isExternal = context.isExternalLogin;
            page.bindingContext.externalAccessToken = context.externalAccessToken;

            let backImage = <Image>page.getViewById("back");
            backImage.visibility = "collapse";
        }
        else if(context.isExternalLogin != 'undefined' && !context.isExternalLogin) {
            page.bindingContext.email = context.email;
            page.bindingContext.password = context.password;
            page.bindingContext.isExternal = context.isExternalLogin;

            let backImage = <Image>page.getViewById("back");
            backImage.visibility = "visible";
        }
    }
}

export function onRegisterTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RegisterPersonalViewModel>button.bindingContext;

    if(!viewModel.validateEmptyData() || !viewModel.validateFields()){
        return;
    }

    let url = `${APIConstants.Domain}/${APIConstants.UsersCreateEndpoint}`;
    let contentType = 'application/json';

    let content = JSON.stringify({ 
        "email": viewModel.email,
        "firstName": viewModel.firstName,
        "lastName": viewModel.lastName,
        "password": viewModel.password,
        "isExternal": viewModel.isExternal,
        "userExternalId": viewModel.userExternalId,
        "phoneNumber": viewModel.phoneNumber,
        "age": viewModel.age,
        "bloodType": viewModel.selectedBloodType,
        "accessToken": viewModel.externalAccessToken,
        "preferredLanguage": secureStorage.getSync({key: "language" })
     });

    HttpClient.postRequest(url, content, null, contentType)
        .then((response) => {
            const result = response.content.toJSON();

            if (response.statusCode == 400) {
                // TODO: Handle error 
            }

            let loginUrl = `${APIConstants.Domain}/${APIConstants.AuthorizeEndpoint}`;
            let contentType = 'application/x-www-form-urlencoded';
            let content = `grant_type=password&username=${viewModel.email}&password=${viewModel.password}`;
            
            if(viewModel.externalAccessToken) {
                content += `&external=true&access_token=${viewModel.externalAccessToken}`;
            }
            
            HttpClient.postRequest(loginUrl, content, null, contentType)
                .then((response) => {
                    const result = response.content.toJSON();
                    
                    if (response.statusCode == 400) {
                        // TODO: Handle error.
                    }
        
                    if (response.statusCode == 200 && result.hasOwnProperty("access_token")) {
                        secureStorage.set({
                            key: "access_token",
                            value: result["access_token"]
                          }).then((resolve) => {
                                let navigationEntry = {
                                    moduleName: "home/home-page",
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
        }, (reject) => {
            //TODO: handle request failure
    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RegisterPersonalViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "register/register-user-information/register-user-page",
        context: { 
            "email": viewModel.email, 
            "password": viewModel.password },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onBloodTypeTap(args: EventData): void {
    const label = <Label>args.object;
    const viewModel = <RegisterPersonalViewModel>label.bindingContext;

    const wrapLayout = label.parent;
    for(var i = 1; i <= 8; i += 1){
        var childLabel = wrapLayout.getViewById(`option-${i}`);
        childLabel.className = "blood-type-button";
    }
    label.className = "blood-type-button selected";

    var myRegexp = /(.*)-([0-9]{1})/;
    var match = myRegexp.exec(label.id);
    
    viewModel.selectedBloodType = +match[2];
}
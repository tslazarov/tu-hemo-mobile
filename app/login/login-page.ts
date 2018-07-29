import { EventData } from "data/observable";
import { Button } from "ui/button";
import { NavigatedData, Page } from "ui/page";
import { LoginViewModel } from "./login-view-model";
import { Frame, topmost } from "tns-core-modules/ui/frame";
import { APIConstants } from "../constants/api-endpoints";
import { GraphAPIConstants } from "../constants/graph-api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { login as fbLogin } from "nativescript-facebook";
import { TNSFancyAlert } from 'nativescript-fancyalert';

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: NavigatedData) {    
    const page = <Page>args.object;
    page.addCssFile("login-page.css");
    page.bindingContext = new LoginViewModel(secureStorage.getSync({key: "language" }));
}

export function onPageLoaded(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new LoginViewModel(secureStorage.getSync({key: "language" }));
}

export function onLoginWithFacebookButtonTap(args: EventData): void {
    const button = <Button>args.object;
    const viewModel = <LoginViewModel>button.bindingContext;

        fbLogin((err, fbData) => {
          if (err) {
            alert("Error during login: " + err.message);
          } else {
            console.log(fbData.token);
            let fbAccessToken = fbData.token;

            let url = `${GraphAPIConstants.Domain}/${GraphAPIConstants.MeEndpoint}`;

            HttpClient.getJSONGraphAPIRequest(url, fbAccessToken)
                .then((response) => {

                    let fbName = response.name;
                    let fbUserId = response.id;

                    let fieldsUrl = `${GraphAPIConstants.Domain}/${fbUserId}${GraphAPIConstants.FieldsEndpoint}`;

                    HttpClient.getJSONGraphAPIRequest(fieldsUrl, fbAccessToken)
                        .then((response) => {
                            console.log(response);

                            let fbEmail = response.email;
                            let fbFirstName = response.first_name;
                            let fbLastName = response.last_name;

                            TNSFancyAlert.showInfo(fbName, '', viewModel.confirm)
                            .then(() => {
                                
                                let existingUserUrl = `${APIConstants.Domain}/${APIConstants.UsersExistEndpoint}`;
                                let existingUserContentType = 'application/json';
                                let existingUserContent = JSON.stringify({ "email": fbEmail });

                                HttpClient.putRequest(existingUserUrl, existingUserContent, null, existingUserContentType)
                                .then((response) => {
                                    const result = response.content.toJSON();
                            
                                    if(result) {
                                        
                                        let loginUrl = `${APIConstants.Domain}/${APIConstants.AuthorizeEndpoint}`;
                                        let contentType = 'application/x-www-form-urlencoded';
                                        let content = `grant_type=password&username=${fbEmail}&password=${viewModel.password}&external=true&access_token=${fbAccessToken}`;
                                    
                                        HttpClient.postRequest(loginUrl, content, null, contentType)
                                            .then((response) => {
                                                const result = response.content.toJSON();
                                                
                                                console.log(result);

                                                if (response.statusCode == 400) {
                                                    console.log("Invalid");
                                                    viewModel.showInvalidEmailOrPasswordAndMessage();
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
                                    }
                                    else {
                                        const navigationEntry = {
                                            moduleName: "register/register-personal-information/register-personal-page",
                                            context: { 
                                                "email": fbEmail, 
                                                "firstName": fbFirstName,
                                                "lastName": fbLastName,
                                                "userExternalId": fbUserId,
                                                "isExternalLogin": true,
                                                "externalAccessToken": fbAccessToken },
                                            clearHistory: true
                                        };
                                    
                                        topmost().navigate(navigationEntry);
                                    }
                                }, (reject) => {
                                });

                            }); 
                        }, (reject) => {

                        });
                }, (reject) => {

                });
          }
    });
}

export function onLoginButtonTap(args: EventData): void {
    const button = <Button>args.object;
    const viewModel = <LoginViewModel>button.bindingContext;

    if(!viewModel.validateEmptyEmailOrPassword()) {
        return;
    }

    let url = `${APIConstants.Domain}/${APIConstants.AuthorizeEndpoint}`;
    let contentType = 'application/x-www-form-urlencoded';
    let content = `grant_type=password&username=${viewModel.email}&password=${viewModel.password}`;

    HttpClient.postRequest(url, content, null, contentType)
        .then((response) => {
            const result = response.content.toJSON();

            if (response.statusCode == 400) {
                viewModel.showInvalidEmailOrPasswordAndMessage();
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
}

export function onListPickerLoaded(args): void {
    const listPicker = args.object;
    const viewModel = listPicker.page.getViewById("LoginPanel");

    listPicker.on("selectedIndexChange", (lpargs) => {
        let languages = ["en", "bg"];
        const listPicker = lpargs.object;
        secureStorage.set({ key: "language", value: languages[listPicker.selectedIndex] });

        // hacky way to rebind labels - not optimal but necessary due to issue with binding context
        let navigationEntry = {
            moduleName: "login/login-page",
            clearHistory: true
        };

        topmost().navigate(navigationEntry);
    });
}

export function onNavigateRegisterTap() {
    let navigationEntry = {
        moduleName: "register/register-user-information/register-user-page",
    };

    topmost().navigate(navigationEntry);
}

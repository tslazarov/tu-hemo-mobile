import { EventData } from "data/observable";
import { Button } from "ui/button";
import { NavigatedData, Page } from "ui/page";
import { LoginViewModel } from "./login-view-model";
import { Frame, topmost } from "tns-core-modules/ui/frame";
import { APIConstants } from "../constants/api-endpoints";
import { GraphAPIConstants } from "../constants/graph-api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { ListPicker } from "ui/list-picker";
import { login as fbLogin } from "nativescript-facebook";
import { TNSFancyAlert, TNSFancyAlertButton } from 'nativescript-fancyalert';

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
            let accessToken = fbData.token;

            let url = `${GraphAPIConstants.Domain}/${GraphAPIConstants.MeEndpoint}`;

            HttpClient.getJSONGraphAPIRequest(url, accessToken)
                .then((response) => {

                    let name = response.name;
                    let userId = response.id;

                    let emailUrl = `${GraphAPIConstants.Domain}/${userId}${GraphAPIConstants.FieldsEndpoint}`;

                    HttpClient.getJSONGraphAPIRequest(emailUrl, accessToken)
                        .then((response) => {
                            console.log(response);
                            TNSFancyAlert.showInfo(name, '', viewModel.confirm)
                            .then(() => {
                                // Check user and set stuff and redirect to appropriate page
                            }); 
                        }, (error) => {

                        });           
                }, (reject) => {

                })
          }
        });
}

export function onLoginInButtonTap(args: EventData): void {
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
                console.log("Invalid");
                viewModel.showInvalidEmailOrPasswordAndMessage();
            }

            if (response.statusCode == 200 && result.hasOwnProperty("access_token")) {
                secureStorage.set({
                    key: "access_token",
                    value: result["access_token"]
                  }).then((resolve) => {
                        let topmostFrame: Frame = topmost(); 

                        let navigationEntry = {
                            moduleName: "home/home-page",
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

import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { APIConstants } from "../../constants/api-endpoints";
import { SecureStorage } from "nativescript-secure-storage";
import { Frame, topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { ChangeLanguageViewModel } from "./change-language-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.addCssFile("login-page.css");
    page.bindingContext = new ChangeLanguageViewModel(secureStorage.getSync({key: "language" }));
}

export function onChangeTap(args: EventData): void { 
    let languages = ["en", "bg"];
    const button = <Button>args.object;
    const viewModel = <ChangeLanguageViewModel>button.bindingContext;

    let url = `${APIConstants.Domain}/${APIConstants.ChangeLanguageEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "selectedLanguage": viewModel.selectedLanguage });
    secureStorage.set({ 
        key: "language", 
        value: languages[viewModel.selectedLanguage] 
    }).then((resolve) => {
        HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
        .then((response) => {
            const result = response.content.toJSON();

            if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {

                if(result["isSuccessful"]) {
                    const navigationEntry = {
                        moduleName: "settings/settings-page",
                        clearHistory: true
                    };
                
                    topmost().navigate(navigationEntry);
                }
            }

        }, (reject) => {

        });
    });
}

export function onBackTap(args: EventData): void { 
    const navigationEntry = {
        moduleName: "settings/settings-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

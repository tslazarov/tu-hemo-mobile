import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Image } from "ui/image";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { ImageSource, fromBase64 } from "image-source";
import { Frame, topmost } from "tns-core-modules/ui/frame/frame";
import {exit} from 'nativescript-exit';

import { SettingsViewModel } from "./settings-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.addCssFile("login-page.css");
    page.bindingContext = new SettingsViewModel();

    setProfile(page);
}

export function setProfile(page: Page) {

    let viewModel: SettingsViewModel = page.bindingContext;

    let userBasicProfileUrl = `${APIConstants.Domain}/${APIConstants.UsersBasicProfileEndpoint}`;
    
    HttpClient.getRequest(userBasicProfileUrl, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();

        if(result && result.hasOwnProperty("email") && result.hasOwnProperty("name") && result.hasOwnProperty("profileImage")) {
            viewModel.email = result["email"];
            viewModel.name = result["name"];
            viewModel.isExternal = result["isExternal"];

            if(viewModel.isExternal) {
                viewModel.visibilityMode = "collapsed";
            }
            else {
                viewModel.visibilityMode = "visible";
            }

           if(result["profileImage"] != null) {
                let image = <Image>page.getViewById("ProfileImage");

                if(image != null) {
                    image.imageSource = fromBase64(result["profileImage"]);
                }
           }
        }
    }, (reject) => {

    });
}

export function onChangePasswordTap(args: EventData): void {
    let navigationEntry = {
        moduleName: "settings/change-password/change-password-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onChangeEmailTap(args: EventData): void {
    let navigationEntry = {
        moduleName: "settings/change-email/change-email-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onChangeLanguageTap(args: EventData): void {
    let navigationEntry = {
        moduleName: "settings/change-language/change-language-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onLogoutTap(args: EventData): void {
    secureStorage.removeAll().then((success) => {
        exit();
    });
}

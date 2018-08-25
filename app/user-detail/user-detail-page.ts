import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Image } from "tns-core-modules/ui/image/image";
import { Button } from "ui/button";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { fromBase64, fromResource } from "tns-core-modules/image-source/image-source";
import { topmost } from "tns-core-modules/ui/frame/frame";
import * as TNSPhone from 'nativescript-phone';

import { UserDetailViewModel } from "./user-detail-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("user-detail-page.css");
    page.bindingContext = new UserDetailViewModel();

    if(typeof context != 'undefined' && context) {
        page.bindingContext.id = context.id;
        page.bindingContext.requestId = context.requestId;
    }
    setProfile(page);
}

export function setProfile(page: Page) {
    let viewModel: UserDetailViewModel = page.bindingContext;

    let url = `${APIConstants.Domain}/${APIConstants.UsersGetUserEndpoint}/${viewModel.id}`;
    
    console.log(url);

    HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();
        console.log(result);
        if(result && result.hasOwnProperty("email")) {
            viewModel.email = result["email"];
            viewModel.name = `${result["firstName"]} ${result["lastName"]}`;
            viewModel.phoneNumber = result["phoneNumber"];
            viewModel.bloodType = viewModel.bloodTypes[result["bloodType"]];

           if(result["profileImage"] != null) {
                let image = <Image>page.getViewById("ProfileImage");

                if(image != null) {
                    image.imageSource = fromBase64(result["profileImage"]);
                }
           }
           else {
                let image = <Image>page.getViewById("ProfileImage");

                if(image != null) {
                    image.imageSource = fromResource("profile_image");
                }
            }
        }
    }, (reject) => {

    });
}

export function onDialUpTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <UserDetailViewModel>button.bindingContext;

    TNSPhone.dial(viewModel.phoneNumber, true);
}

export function onBackTap(args: EventData): void { 
    const image = <Image>args.object;
    const viewModel = <UserDetailViewModel>image.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-detail/request-detail-page",
        context: {
            "id": viewModel.requestId
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { Image } from "ui/image";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { fromBase64 } from "tns-core-modules/image-source/image-source";

import { SearchDetailViewModel } from "./search-detail-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./search/search-detail/search-detail-page.css");

    page.bindingContext = new SearchDetailViewModel();

    if(typeof context != 'undefined' && context) {
            page.bindingContext.id = context.id;
    }

    setRequest(page, context.id);
}

export function setRequest(page, id:string) {

    let viewModel: SearchDetailViewModel = page.bindingContext;

    let userBasicProfileUrl = `${APIConstants.Domain}/${APIConstants.RequestGetRequestEndpoint}/${id}`;
    
    HttpClient.getRequest(userBasicProfileUrl, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();
        console.log(result);
        if(result && result.hasOwnProperty("owner")) {
            console.log(result);
            viewModel.owner = result["owner"];
            viewModel.requestedBloodType = result["requestedBloodType"];
            viewModel.requestedBloodQuantity = result["requestedBloodQuantity"];
        //     viewModel.isExternal = result["isExternal"];

        //     if(viewModel.isExternal) {
        //         viewModel.visibilityMode = "collapsed";
        //     }
        //     else {
        //         viewModel.visibilityMode = "visible";
        //     }

        //    if(result["profileImage"] != null) {
        //         let image = <Image>page.getViewById("ProfileImage");

        //         if(image != null) {
        //             image.imageSource = fromBase64(result["profileImage"]);
        //         }
        //    }
        }
    }, (reject) => {

    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <SearchDetailViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "search/search-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

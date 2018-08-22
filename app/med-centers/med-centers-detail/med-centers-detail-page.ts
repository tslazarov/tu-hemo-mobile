import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { Image } from "ui/image";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { fromBase64, fromResource } from "tns-core-modules/image-source/image-source";
import * as TNSPhone from 'nativescript-phone';

import { MedCentersDetailViewModel } from "./med-centers-detail-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./search/search-detail/search-detail-page.css");

    page.bindingContext = new MedCentersDetailViewModel();

    if(typeof context != 'undefined' && context) {
            page.bindingContext.id = context.id;
    }

    setMedCenter(page, context.id);
}

export function setMedCenter(page, id:string) {

    let viewModel: MedCentersDetailViewModel = page.bindingContext;

    let url = `${APIConstants.Domain}/${APIConstants.MedCentersGetCenterEndpoint}/${id}`;
    
    HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();
        if(result && result.hasOwnProperty("name")) {
            viewModel.name = result["name"];
            viewModel.address = result["address"];
            viewModel.phoneNumber = result["phoneNumber"];
            viewModel.email = result["email"];
            viewModel.latitude = result["latitude"];
            viewModel.longitude = result["longitude"];
            
           if(result["image"] != null) {
                let image = <Image>page.getViewById("MedCenterImage");
                if(image != null) {
                    let image = <Image>page.getViewById("MedCenterImage");

                    if(image != null) {
                        image.imageSource = fromBase64(result["image"]);
                    }
                }
                else
                {
                    let image = <Image>page.getViewById("MedCenterImage");

                    if(image != null) {
                        image.imageSource = fromResource("res://profile_image");
                    }                
                }
           }
        }
    }, (reject) => {

    });
}

export function onBackTap(args: EventData): void { 
    const image = <Image>args.object;
    const viewModel = <MedCentersDetailViewModel>image.bindingContext;

    const navigationEntry = {
        moduleName: "med-centers/med-centers-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onMapReady(args) {
    let map = args.map;
    const viewModel = <MedCentersDetailViewModel>map.bindingContext;

    map.setCenter({
        lat: viewModel.latitude,
        lng: viewModel.longitude,
        animated: true
        });

    map.addMarkers([
        {
            id: 1,
            lat: viewModel.latitude,
            lng: viewModel.longitude
    }]);
}

export function onDialUpTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <MedCentersDetailViewModel>button.bindingContext;

    TNSPhone.dial(viewModel.phoneNumber, true);

}

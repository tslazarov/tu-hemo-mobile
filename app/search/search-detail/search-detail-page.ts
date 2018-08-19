import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { Image } from "ui/image";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { fromBase64, fromResource } from "tns-core-modules/image-source/image-source";
import { DateFormatter } from "../../utilities/date-formatter";
import { MessageService } from "../../utilities/message-service"
import { TranslationService } from "../../utilities/translation-service"


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

    let url = `${APIConstants.Domain}/${APIConstants.RequestGetRequestEndpoint}/${id}`;
    
    HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();
        if(result && result.hasOwnProperty("owner")) {
            viewModel.owner = result["owner"];
            viewModel.requestedBloodType = viewModel.bloodTypes[result["requestedBloodType"]];
            viewModel.requestedBloodQuantity = result["requestedBloodQuantity"];
            viewModel.date = DateFormatter.toDate(result["date"]);
            viewModel.address = result["address"];
            viewModel.latitude = result["latitude"];
            viewModel.longitude = result["longitude"];
            viewModel.isSigned = result["isSigned"];
            
           if(result["owner"]["image"] != null) {
                let image = <Image>page.getViewById("ProfileImage");
                if(image != null) {
                    let image = <Image>page.getViewById("ProfileImage");

                    if(image != null) {
                        image.imageSource = fromBase64(result["owner"]["image"]);
                    }
                }
                else{
                    let image = <Image>page.getViewById("ProfileImage");

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
    const button = <Button>args.object;
    const viewModel = <SearchDetailViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "search/search-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onMapReady(args) {
    let map = args.map;
    const viewModel = <SearchDetailViewModel>map.bindingContext;

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

export function onSignUpTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <SearchDetailViewModel>button.bindingContext;

    let message;
    let url = `${APIConstants.Domain}/${APIConstants.RequestAddDonatorEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "id": viewModel.id });

    HttpClient.postRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {
            if(result["isSuccessful"]) {
                message = TranslationService.localizeValue("addDonatorSuccess", "search-detail-page", "message");
                MessageService.showSuccess(message, viewModel.feedback);

                viewModel.isSigned = true;
            }
            else{
                message = TranslationService.localizeValue("addDonatorFail", "search-detail-page", "message");
                MessageService.showError(message, viewModel.feedback);
            }
        }
    }, (reject) => {

    });
}

export function onCancelTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <SearchDetailViewModel>button.bindingContext;

    let message;
    let url = `${APIConstants.Domain}/${APIConstants.RequestRemoveDonatorEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "id": viewModel.id });

    HttpClient.postRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {
            if(result["isSuccessful"]) {
                message = TranslationService.localizeValue("removeDonatorSuccess", "search-detail-page", "message");
                MessageService.showSuccess(message, viewModel.feedback);

                viewModel.isSigned = false;
            }
            else {
                message = TranslationService.localizeValue("removeDonatorFail", "search-detail-page", "message");
                MessageService.showError(message, viewModel.feedback);
            }
        }
    }, (reject) => {

    });
}
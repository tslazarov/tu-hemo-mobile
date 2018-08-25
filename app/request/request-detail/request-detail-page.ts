import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { Label } from "ui/label";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { SecureStorage } from "nativescript-secure-storage";
import { DateFormatter } from "../../utilities/date-formatter";

import { RequestDetailViewModel } from "./request-detail-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page: Page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./request/request-detail/request-detail-page.css");

    page.bindingContext = new RequestDetailViewModel();

    if(typeof context != 'undefined' && context) {
            page.bindingContext.id = context.id;
    }
    if(typeof context.wrappedMaster != 'undefined') {
        page.bindingContext = context.wrappedMaster;
    }
    else{
        setRequest(page, context.id);
    }
}

export function setRequest(page, id:string) {

    let viewModel: RequestDetailViewModel = page.bindingContext;

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

            if(result.hasOwnProperty("donators")) {
                result["donators"].forEach(donator => {
                    viewModel.items.push({ 
                        "id": donator.id,
                        "name": donator.name,
                        "bloodType": viewModel.bloodTypes[donator.bloodType],
                        "status": donator.isApproved ? viewModel.confirmedLabel : viewModel.pendingLabel,
                        "bloodTypeLabel": viewModel.bloodTypeLabel,
                        "isApproved": donator.isApproved
                    })
                });
            }
        }
    }, (reject) => {

    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RequestDetailViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onConfirmTap(args: EventData): void { 
    const label = <Label>args.object;
    const viewModel = <RequestDetailViewModel>label.page.bindingContext;

    const card = label.parent.parent.parent;
    const id = card.id;

    viewModel.items.forEach(i => {
        if(i.id == id) {
            i.status = viewModel.confirmedLabel
            i.isApproved = true
        }
    });

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.RequestConfirmDonatorEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "userId": id, "requestId": viewModel.id });

    HttpClient.putRequest(url, content,  secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")){
            if(result["isSuccessful"]) {
                const navigationEntry = {
                    moduleName: "request/request-detail/request-detail-page",
                    context: {
                        "id": viewModel.id,
                        "wrappedMaster": viewModel,
                    },
                    animated: false,
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {
    });
}

export function onPendingTap(args: EventData): void { 
    const label = <Label>args.object;
    const viewModel = <RequestDetailViewModel>label.page.bindingContext;

    const card = label.parent.parent.parent;
    const id = card.id;

    viewModel.items.forEach(i => {
        if(i.id == id) {
            i.status = viewModel.pendingLabel
            i.isApproved = false
        }
    });

    let message;
    
    let url = `${APIConstants.Domain}/${APIConstants.RequestDisconfirmDonatorEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ "userId": id, "requestId": viewModel.id });

    HttpClient.putRequest(url, content,  secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")){
            if(result["isSuccessful"]) {
                const navigationEntry = {
                    moduleName: "request/request-detail/request-detail-page",
                    context: {
                        "id": viewModel.id,
                        "wrappedMaster": viewModel,
                    },
                    animated: false,
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {
    });
}

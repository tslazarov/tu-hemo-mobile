import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Label } from "tns-core-modules/ui/label/label";
import { Button } from "tns-core-modules/ui/button/button";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { SecureStorage } from "nativescript-secure-storage";
import { MessageService } from "../../utilities/message-service";
import { TranslationService } from "../../utilities/translation-service"

import { RequestCreateEditViewModel } from "./request-create-edit-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./request/request-create/request-create-page.css");

    page.bindingContext = new RequestCreateEditViewModel();

    if(typeof context != 'undefined' && context && context.container && context.container.address) {
        page.bindingContext.address = context.container.address;
        page.bindingContext.city = context.container.city;
        page.bindingContext.country = context.container.country;
        page.bindingContext.latitude = context.container.latitude;
        page.bindingContext.longitude = context.container.longitude;
        page.bindingContext.bloodQuantity = context.container.bloodQuantity;
        page.bindingContext.selectedBloodType = context.container.selectedBloodType;
        page.bindingContext.isEditMode = context.container.isEditMode;
        page.bindingContext.id = context.container.id;
    } 
    else if(typeof context != 'undefined' && context && context.container && context.container.isEditMode) {
        page.bindingContext.id = context.container.id;
        page.bindingContext.isEditMode = context.container.isEditMode;

        setRequest(page, context.container.id);
    }
}

export function setRequest(page, id:string) {
    let viewModel: RequestCreateEditViewModel = page.bindingContext;

    let url = `${APIConstants.Domain}/${APIConstants.RequestGetRequestEndpoint}/${id}`;
    
    HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();
        if(result && result.hasOwnProperty("owner")) {
            viewModel.bloodQuantity = result["requestedBloodQuantity"];
            viewModel.address = result["address"];
            viewModel.city = result["city"];
            viewModel.country = result["country"];
            viewModel.latitude = result["latitude"];
            viewModel.longitude = result["longitude"];

            viewModel.selectedBloodType = result.hasOwnProperty("requestedBloodType") ? result["requestedBloodType"] : 0;;
            
            console.log(result["requestedBloodType"]);

            const wrapLayout = page.getViewById("bloodTypeWrap");
            var selectedBloodTypeLabel = wrapLayout.getViewById(`option-${viewModel.selectedBloodType}`);
            selectedBloodTypeLabel.className = "blood-type-button selected";
        }
    }, (reject) => {

    });
}
export function onCreateTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RequestCreateEditViewModel>button.bindingContext;
    
    if(!viewModel.validateEmptyData() || !viewModel.validateFields()){
        return;
    }

    let message;
    let url = `${APIConstants.Domain}/${APIConstants.RequestsCreateRequestEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ 
        "address": viewModel.address, 
        "city": viewModel.city, 
        "country": viewModel.country, 
        "latitude": viewModel.latitude, 
        "longitude": viewModel.longitude, 
        "bloodQuantity": viewModel.bloodQuantity, 
        "requestedBloodType": viewModel.selectedBloodType
    });

    HttpClient.postRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {

            if(result["isSuccessful"]) {

                message = TranslationService.localizeValue("createRequestSuccess", "request-create-edit-page", "message");
                MessageService.showSuccess(message, viewModel.feedback);

                const navigationEntry = {
                    moduleName: "request/request-page",
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {

    });
}

export function onEditTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RequestCreateEditViewModel>button.bindingContext;
    
    if(!viewModel.validateEmptyData() || !viewModel.validateFields()){
        return;
    }

    let message;
    let url = `${APIConstants.Domain}/${APIConstants.RequestsEditRequestEndpoint}`;
    let contentType = 'application/json';
    let content = JSON.stringify({ 
        "address": viewModel.address, 
        "city": viewModel.city, 
        "country": viewModel.country, 
        "latitude": viewModel.latitude, 
        "longitude": viewModel.longitude, 
        "bloodQuantity": viewModel.bloodQuantity, 
        "requestedBloodType": viewModel.selectedBloodType,
        "id": viewModel.id
    });

    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
    .then((response) => {
        const result = response.content.toJSON();

        if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {

            if(result["isSuccessful"]) {

                message = TranslationService.localizeValue("editRequestSuccess", "request-create-edit-page", "message");
                MessageService.showSuccess(message, viewModel.feedback);

                const navigationEntry = {
                    moduleName: "request/request-page",
                    clearHistory: true
                };
            
                topmost().navigate(navigationEntry);
            }
        }
    }, (reject) => {

    });
}

export function onBackTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RequestCreateEditViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onBloodTypeTap(args: EventData): void {
    const label = <Label>args.object;
    const viewModel = <RequestCreateEditViewModel>label.bindingContext;

    const wrapLayout = label.parent;
    for(var i = 0; i <= 7; i += 1){
        var childLabel = wrapLayout.getViewById(`option-${i}`);
        childLabel.className = "blood-type-button";
    }
    label.className = "blood-type-button selected";

    var myRegexp = /(.*)-([0-9]{1})/;
    var match = myRegexp.exec(label.id);
    
    viewModel.selectedBloodType = +match[2];
}
export function onAddressTap(args: EventData): void { 
    const textField = <TextField>args.object;
    const viewModel = <RequestCreateEditViewModel>textField.bindingContext;

    const navigationEntry = {
        moduleName: "request/pick-location/pick-location-page",
        context: {
            "container": {
                "address": viewModel.address,
                "city": viewModel.city,
                "country": viewModel.country,
                "latitude": viewModel.latitude,
                "longitude": viewModel.longitude,
                "bloodQuantity": viewModel.bloodQuantity,
                "selectedBloodType": viewModel.selectedBloodType,
                "isEditMode": viewModel.isEditMode,
                "id": viewModel.id
            }
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onWrapLayoutLoaded(args) {
    const page = args.object.page;
    const viewModel = <RequestCreateEditViewModel>page.bindingContext;

    if(viewModel.selectedBloodType) {
        const wrapLayout = page.getViewById("bloodTypeWrap");
        var selectedBloodTypeLabel = args.object.getViewById(`option-${viewModel.selectedBloodType}`);
        selectedBloodTypeLabel.className = "blood-type-button selected";
    }
}
import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { TextField } from "ui/text-field";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { HttpClient } from "../../utilities/http-client";
import { APIConstants } from "../../constants/api-endpoints";
import { SecureStorage } from "nativescript-secure-storage";

import { RequestCreateViewModel } from "./request-create-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./request/request-create/request-create-page.css");

    page.bindingContext = new RequestCreateViewModel();

    if(typeof context != 'undefined' && context && context.container) {
        page.bindingContext.address = context.container.address;
        page.bindingContext.city = context.container.city;
        page.bindingContext.country = context.container.country;
        page.bindingContext.latitude = context.container.latitude;
        page.bindingContext.longitude = context.container.longitude;
        page.bindingContext.bloodQuantity = context.container.bloodQuantity;
        page.bindingContext.selectedBloodType = context.container.selectedBloodType;
    }
}

export function onCreateTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <RequestCreateViewModel>button.bindingContext;
    
    if(!viewModel.validateEmptyData() || !viewModel.validateFields()){
        return;
    }
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
    const viewModel = <RequestCreateViewModel>button.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onBloodTypeTap(args: EventData): void {
    const label = <Label>args.object;
    const viewModel = <RequestCreateViewModel>label.bindingContext;

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
    const viewModel = <RequestCreateViewModel>textField.bindingContext;

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
                "selectedBloodType": viewModel.selectedBloodType
            }
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onWrapLayoutLoaded(args) {
    const page = args.object.page;
    const viewModel = <RequestCreateViewModel>page.bindingContext;

    if(viewModel.selectedBloodType) {
        const wrapLayout = page.getViewById("bloodTypeWrap");
        var selectedBloodTypeLabel = args.object.getViewById(`option-${viewModel.selectedBloodType}`);
        selectedBloodTypeLabel.className = "blood-type-button selected";
    }
}
import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button";
import { Image } from "ui/image";
import { Label } from "ui/label";
import { PhotoUploader } from "../../utilities/photo-uploader";
import { APIConstants } from "../../constants/api-endpoints";
import { HttpClient } from "../../utilities/http-client";
import { TranslationService } from "../../utilities/translation-service";
import { SecureStorage } from "nativescript-secure-storage";
import { fromBase64, fromResource } from "image-source";
import { topmost } from "tns-core-modules/ui/frame/frame";
import { MessageService } from "../../utilities/message-service"

import { ChangePersonalInformationViewModel } from "./change-personal-information-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ChangePersonalInformationViewModel();

    setPersonalInformation(page);
}

export function setPersonalInformation(page: Page) {

    let viewModel: ChangePersonalInformationViewModel = page.bindingContext;

    let userBasicProfileUrl = `${APIConstants.Domain}/${APIConstants.UsersFullProfileEndpoint}`;
    
    HttpClient.getRequest(userBasicProfileUrl, secureStorage.getSync({key: "access_token" }))
    .then((response) => {
        const result = response.content.toJSON();

        if(result) {
            viewModel.firstName = result.hasOwnProperty("firstName") ? result["firstName"] : "";
            viewModel.lastName = result.hasOwnProperty("lastName") ? result["lastName"] : "";
            viewModel.phoneNumber = result.hasOwnProperty("phoneNumber") ? result["phoneNumber"] : "";
            viewModel.age = result.hasOwnProperty("age") ? result["age"] : "";


           if(result.hasOwnProperty("profileImage") && result["profileImage"] != null) {
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

           viewModel.selectedBloodType = result.hasOwnProperty("bloodType") ? result["bloodType"] : 0;;
     
            const wrapLayout = page.getViewById("bloodTypeWrap");
            var selectedBloodTypeLabel = wrapLayout.getViewById(`option-${viewModel.selectedBloodType}`);
            selectedBloodTypeLabel.className = "blood-type-button selected";

        }
    }, (reject) => {

    });
}

export function onChangeTap(args: EventData): void { 
    const button = <Button>args.object;
    const viewModel = <ChangePersonalInformationViewModel>button.bindingContext;

    if(!viewModel.validateEmptyData() || !viewModel.validateFields()){
        return;
    }

    let message;

    let url = `${APIConstants.Domain}/${APIConstants.SettingsChangePersonalInformationEndpoint}`;
    let contentType = 'application/json';

    let content = JSON.stringify({ 
        "firstName": viewModel.firstName,
        "lastName": viewModel.lastName,
        "phoneNumber": viewModel.phoneNumber,
        "age": viewModel.age,
        "bloodType": viewModel.selectedBloodType,
        "image": viewModel.imageAsBase64     
    });

    HttpClient.putRequest(url, content, secureStorage.getSync({key: "access_token" }), contentType)
        .then((response) => {
            const result = response.content.toJSON();

            if(response.statusCode == 200 && result.hasOwnProperty("isSuccessful")) {
                if(result["isSuccessful"]) {
                    message = TranslationService.localizeValue("personalInformationChanged", "change-personal-information-page", "message");
        
                    MessageService.showSuccess(message, viewModel.feedback);
        
                    const navigationEntry = {
                        moduleName: "settings/settings-page",
                        clearHistory: true
                    };
                
                    topmost().navigate(navigationEntry);
                }
                else if(result.hasOwnProperty("state")) {
    
                    if(result["state"] == "incorrect_password") {               
                        message = TranslationService.localizeValue("personalInformationNotChanged", "change-personal-information-page", "message");
                    }
    
                    MessageService.showError(message, viewModel.feedback);
                }
            }

        }, (reject) => {
            //TODO: handle request failure
    });
}

export function onBackTap(args: EventData): void { 
    const navigationEntry = {
        moduleName: "settings/settings-page",
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onBloodTypeTap(args: EventData): void {
    const label = <Label>args.object;
    const viewModel = <ChangePersonalInformationViewModel>label.bindingContext;

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

export function onSelectSingleTap(args: EventData): void {
    const button = <Button>args.object;
    const viewModel = <ChangePersonalInformationViewModel>button.bindingContext;
    
    viewModel.isSingleMode = true;
    PhotoUploader.selectImage()
    .then((response) => {
        if(response) {
            let base64 = response.toBase64String("png");

            viewModel.imageAsBase64 = base64;
            let image = <Image>button.page.getViewById("ProfileImage");

            if(image != null) {
                image.imageSource = fromBase64(base64);
            }
        }
    }, (reject) => {
    })
}



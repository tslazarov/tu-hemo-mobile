import { EventData } from "data/observable";
import { Page } from "ui/page";
import { Button } from "ui/button"
import { PhotoUploader } from "../../utilities/photo-uploader";


import { ChangePersonalInformationViewModel } from "./change-personal-information-view-model";

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new ChangePersonalInformationViewModel();
}

export function onSelectSingleTap(args: EventData): void {
    const button = <Button>args.object;
    const viewModel = <ChangePersonalInformationViewModel>button.bindingContext;
    
    viewModel.isSingleMode = true;
    PhotoUploader.selectImage()
    .then((response) => {
        console.log(response);
        console.log(response.toBase64String("png"));
    }, (reject) => {
        console.log(reject);
    })
}



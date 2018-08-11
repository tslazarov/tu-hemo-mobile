import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";

export class ChangePersonalInformationViewModel extends Observable {

    previewSize: any = 200;

    @ObservableProperty() imageSrc: any;
    @ObservableProperty() isSingleMode: boolean;

    constructor() {
        super();
    }
}

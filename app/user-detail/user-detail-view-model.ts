import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"

export class UserDetailViewModel extends Observable {

    // labels
    dialUp: string;

    @ObservableProperty() id: string;
    @ObservableProperty() name: string;
    @ObservableProperty() email: string;
    @ObservableProperty() bloodType: string;
    @ObservableProperty() phoneNumber: string;
    @ObservableProperty() requestId: string;

    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]
    constructor() {
        super();

        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.dialUp = TranslationService.localizeValue("dialUp", "user-detail-page", "label");
    }
}
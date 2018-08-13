import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TranslationService } from "../utilities/translation-service"

export class RequestViewModel extends Observable {
    // labels
    requests: string;
    bloodTypeLabel: string;
    dateLabel: string;
    requestedBloodQuantityLabel: string;

    items: ObservableArray<any>;
    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]
    constructor() {
        super();

        this.items = new ObservableArray<any>();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.requests = TranslationService.localizeValue("requests", "request-page", "label");        
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "request-page", "label");        
        this.dateLabel = TranslationService.localizeValue("dateLabel", "request-page", "label");
        this.requestedBloodQuantityLabel = TranslationService.localizeValue("requestedBloodQuantityLabel", "request-page", "label");
    }
}

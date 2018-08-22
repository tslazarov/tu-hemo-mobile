import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"
import { Feedback } from "nativescript-feedback";

export class RequestDetailViewModel extends Observable {
    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;    

    // labels
    bloodTypeLabel: string;
    bloodQuantityLabel: string;
    quantityMlMeasurment: string;
    dateLabel: string;
    emailLabel: string;
    phoneNumberLabel: string;
    addressLabel: string;
    contactInformation: string;
    requestInformation: string;
    confirmedLabel: string;
    pendingLabel: string;
    feedback: Feedback;

    items: ObservableArray<any>;

    @ObservableProperty() wrappedMaster: any;
    @ObservableProperty() id: string;
    @ObservableProperty() owner: any;
    @ObservableProperty() address: string;
    @ObservableProperty() date: string;
    @ObservableProperty() longitude;
    @ObservableProperty() latitude;
    @ObservableProperty() requestedBloodType;
    @ObservableProperty() requestedBloodQuantity;

    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]
    constructor() {
        super();

        this.items = new ObservableArray<any>();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "request-detail-page", "label");
        this.bloodQuantityLabel = TranslationService.localizeValue("bloodQuantityLabel", "request-detail-page", "label");
        this.quantityMlMeasurment = TranslationService.localizeValue("quantityMlMeasurment", "request-detail-page", "label");       
        this.dateLabel = TranslationService.localizeValue("dateLabel", "request-detail-page", "label");
        this.emailLabel = TranslationService.localizeValue("emailLabel", "request-detail-page", "label");        
        this.phoneNumberLabel = TranslationService.localizeValue("phoneNumberLabel", "request-detail-page", "label");        
        this.addressLabel = TranslationService.localizeValue("addressLabel", "request-detail-page", "label");        
        this.contactInformation = TranslationService.localizeValue("contactInformation", "request-detail-page", "label");        
        this.requestInformation = TranslationService.localizeValue("requestInformation", "request-detail-page", "label");        
        this.confirmedLabel = TranslationService.localizeValue("confirmedLabel", "request-detail-page", "label");        
        this.pendingLabel = TranslationService.localizeValue("pendingLabel", "request-detail-page", "label");        
    }

    get groupingFunc(): (item: any) => any {
        return (item: any) => {
            return item.status;
        };
    }
}

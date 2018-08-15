import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"

export class SearchDetailViewModel extends Observable {
    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;    

    // labels
    bloodTypeLabel: string;
    bloodQuantityLabel: string;
    quantityMlMeasurment: string;
    dateLabel: string;
    emailLabel: string;
    phoneNumberLabel: string;
    addressLabel: string;
    signUpDonation: string;
    cancelDonation: string;

    @ObservableProperty() wrappedMaster: any;
    @ObservableProperty() id: string;
    @ObservableProperty() owner: any;
    @ObservableProperty() address: string;
    @ObservableProperty() date: string;
    @ObservableProperty() longitude;
    @ObservableProperty() latitude;
    @ObservableProperty() requestedBloodType;
    @ObservableProperty() requestedBloodQuantity;
    @ObservableProperty() isSigned;

    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]
    constructor() {
        super();

        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "search-detail-page", "label");
        this.bloodQuantityLabel = TranslationService.localizeValue("bloodQuantityLabel", "search-detail-page", "label");
        this.quantityMlMeasurment = TranslationService.localizeValue("quantityMlMeasurment", "search-detail-page", "label");       
        this.dateLabel = TranslationService.localizeValue("dateLabel", "search-detail-page", "label");
        this.emailLabel = TranslationService.localizeValue("emailLabel", "search-detail-page", "label");        
        this.phoneNumberLabel = TranslationService.localizeValue("phoneNumberLabel", "search-detail-page", "label");        
        this.addressLabel = TranslationService.localizeValue("addressLabel", "search-detail-page", "label");        
        this.signUpDonation = TranslationService.localizeValue("signUpDonation", "search-detail-page", "label");        
        this.cancelDonation = TranslationService.localizeValue("cancelDonation", "search-detail-page", "label");        
    }
}

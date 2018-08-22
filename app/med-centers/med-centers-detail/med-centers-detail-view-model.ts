import { Observable } from "data/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"
import { Feedback } from "nativescript-feedback";

export class MedCentersDetailViewModel extends Observable {
    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;    

    // labels
    emailLabel: string;
    phoneNumberLabel: string;
    addressLabel: string;
    contactInformation: string;
    dialUp: string;
    feedback: Feedback;

    @ObservableProperty() wrappedMaster: any;
    @ObservableProperty() id: string;
    @ObservableProperty() name: string;
    @ObservableProperty() phoneNumber: string;
    @ObservableProperty() email: string;
    @ObservableProperty() address: string;
    @ObservableProperty() longitude;
    @ObservableProperty() latitude;

    constructor() {
        super();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.emailLabel = TranslationService.localizeValue("emailLabel", "med-centers-detail-page", "label");        
        this.phoneNumberLabel = TranslationService.localizeValue("phoneNumberLabel", "med-centers-detail-page", "label");        
        this.addressLabel = TranslationService.localizeValue("addressLabel", "med-centers-detail-page", "label");        
        this.contactInformation = TranslationService.localizeValue("contactInformation", "med-centers-detail-page", "label");        
        this.dialUp = TranslationService.localizeValue("dialUp", "med-centers-detail-page", "label");        
      
    }
}

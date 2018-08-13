import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";
import { Color } from "tns-core-modules/color/color";

export class RequestCreateViewModel extends Observable {
    // labels
    requestCreate: string;
    addressHint: string;
    bloodQuantityHint: string;
    bloodType: string;
    create: string;

    @ObservableProperty() address: string;
    @ObservableProperty() city: string;
    @ObservableProperty() country: string;
    @ObservableProperty() latitude: string;
    @ObservableProperty() longitude: string;
    @ObservableProperty() selectedBloodType: number;
    @ObservableProperty() bloodQuantity: number;
    feedback: Feedback;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.requestCreate = TranslationService.localizeValue("requestCreate", "request-create-page", "label")        
        this.addressHint = TranslationService.localizeValue("addressHint", "request-create-page", "label")        
        this.bloodQuantityHint = TranslationService.localizeValue("bloodQuantityHint", "request-create-page", "label");
        this.bloodType = TranslationService.localizeValue("bloodType", "request-create-page", "label");
        this.create = TranslationService.localizeValue("create", "request-create-page", "label");
    }

    validateEmptyData():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.address != 'undefined' && this.address)) {
            
            message = TranslationService.localizeValue("emptyAddress", "request-create-page", "message");
            isValid = false;
        } else if(!(typeof this.bloodQuantity != 'undefined' && this.bloodQuantity)) {
            
            message = TranslationService.localizeValue("emptyBloodQuantity", "request-create-page", "message");
            isValid = false;
        }

        if(!isValid) {
            this.feedback.show({
                message: message,
                messageColor: new Color("#FFFFFF"),
                messageSize: 16,
                position: FeedbackPosition.Top,
                type: FeedbackType.Error,
                duration: 3000,
                backgroundColor: new Color("#C91C1C"),
                onTap: () => { this.feedback.hide() }
              });
        }

        return isValid;
    }

    validateFields():boolean {
        let isValid:boolean = true;
        let message:string;

        if(+this.bloodQuantity < 0 || +this.bloodQuantity > 50000) {
            isValid = false;
            message = TranslationService.localizeValue("allowedBloodQuantity", "request-create-page", "message"); 
        } else if(typeof this.selectedBloodType == 'undefined' || !this.selectedBloodType  || this.selectedBloodType < 0 || this.selectedBloodType > 7) {
            isValid = false;
            message = TranslationService.localizeValue("invalidBloodType", "request-create-page", "message"); 
        }

        if(!isValid) {
            this.feedback.show({
                message: message,
                messageColor: new Color("#FFFFFF"),
                messageSize: 16,
                position: FeedbackPosition.Top,
                type: FeedbackType.Error,
                duration: 3000,
                backgroundColor: new Color("#C91C1C"),
                onTap: () => { this.feedback.hide() }
              });
        }

        return isValid;
    }
}

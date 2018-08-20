import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { TranslationService } from "../../utilities/translation-service"
import { Feedback } from "nativescript-feedback";
import { MessageService } from "../../utilities/message-service"

export class RequestCreateEditViewModel extends Observable {
    // labels
    requestCreate: string;
    requestEdit: string;
    addressHint: string;
    bloodQuantityHint: string;
    bloodType: string;
    create: string;
    edit: string;

    @ObservableProperty() address: string;
    @ObservableProperty() city: string;
    @ObservableProperty() country: string;
    @ObservableProperty() latitude: string;
    @ObservableProperty() longitude: string;
    @ObservableProperty() selectedBloodType: number;
    @ObservableProperty() bloodQuantity: number;
    @ObservableProperty() isEditMode: boolean;
    @ObservableProperty() id: string;

    feedback: Feedback;

    constructor() {
        super();

        this.feedback = new Feedback();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.requestCreate = TranslationService.localizeValue("requestCreate", "request-create-edit-page", "label");        
        this.requestEdit = TranslationService.localizeValue("requestEdit", "request-create-edit-page", "label");        
        this.addressHint = TranslationService.localizeValue("addressHint", "request-create-edit-page", "label");        
        this.bloodQuantityHint = TranslationService.localizeValue("bloodQuantityHint", "request-create-edit-page", "label");
        this.bloodType = TranslationService.localizeValue("bloodType", "request-create-edit-page", "label");
        this.create = TranslationService.localizeValue("create", "request-create-edit-page", "label");
        this.edit = TranslationService.localizeValue("edit", "request-create-edit-page", "label");
    }

    validateEmptyData():boolean {
        let isValid:boolean = true;
        let message;
        
        if(!(typeof this.address != 'undefined' && this.address)) {
            
            message = TranslationService.localizeValue("emptyAddress", "request-create-edit-page", "message");
            isValid = false;
        } else if(!(typeof this.bloodQuantity != 'undefined' && this.bloodQuantity)) {
            
            message = TranslationService.localizeValue("emptyBloodQuantity", "request-create-edit-page", "message");
            isValid = false;
        }

        if(!isValid) {
            MessageService.showError(message, this.feedback);
        }

        return isValid;
    }

    validateFields():boolean {
        let isValid:boolean = true;
        let message:string;

        if(+this.bloodQuantity < 0 || +this.bloodQuantity > 50000) {
            isValid = false;
            message = TranslationService.localizeValue("allowedBloodQuantity", "request-create-edit-page", "message"); 
        } else if(typeof this.selectedBloodType == 'undefined'  || this.selectedBloodType < 0 || this.selectedBloodType > 7) {
            isValid = false;
            message = TranslationService.localizeValue("invalidBloodType", "request-create-edit-page", "message"); 
        }

        console.log(typeof this.selectedBloodType == 'undefined');
        console.log(!this.selectedBloodType);
        console.log(this.selectedBloodType);

        if(!isValid) {
            MessageService.showError(message, this.feedback);
        }

        return isValid;
    }
}

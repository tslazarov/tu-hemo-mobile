import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TranslationService } from "../utilities/translation-service"

export class ProfileViewModel extends Observable {

    // labels
    profile: string;
    bloodTypeLabel: string;
    dateLabel: string;
    requestedBloodQuantityLabel: string;
    statsOption: string;
    historyOption: string;
    latestDonation: string;
    locationChart: string;
    periodChart: string;
    @ObservableProperty() cityLabel: string;

    items: ObservableArray<any>;
    locationsPieSource: ObservableArray<any>;
    annualDonationsCartesianSource: ObservableArray<any>;
    @ObservableProperty() visibility1: boolean;
    @ObservableProperty() visibility2: boolean;
    @ObservableProperty() latestDonationId;
    @ObservableProperty() latestDonationBloodType;
    @ObservableProperty() latestDonationRequestedBloodQuantity;
    @ObservableProperty() latestDonationDate;


    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

    selectedBarIndex: number;

    constructor() {
        super();

        this.items = new ObservableArray<any>();
        this.locationsPieSource = new ObservableArray<any>();
        this.annualDonationsCartesianSource = new ObservableArray<any>();
        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.profile = TranslationService.localizeValue("profile", "profile-page", "label");        
        this.statsOption = TranslationService.localizeValue("statsOption", "profile-page", "label");        
        this.historyOption = TranslationService.localizeValue("historyOption", "profile-page", "label");        
        this.latestDonation = TranslationService.localizeValue("latestDonation", "profile-page", "label");        
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "profile-page", "label");        
        this.dateLabel = TranslationService.localizeValue("dateLabel", "profile-page", "label");
        this.requestedBloodQuantityLabel = TranslationService.localizeValue("requestedBloodQuantityLabel", "profile-page", "label");     
        this.locationChart = TranslationService.localizeValue("locationChart", "profile-page", "label");     
        this.periodChart = TranslationService.localizeValue("periodChart", "profile-page", "label");     
        this.cityLabel = TranslationService.localizeValue("cityLabel", "profile-page", "label");         
    }
}

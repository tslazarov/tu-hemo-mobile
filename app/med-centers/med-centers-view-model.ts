import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TokenModel } from "nativescript-ui-autocomplete";
import { GooglePlacesAutocomplete } from "../nativescript-google-places-autocomplete-forked/google-places-autocomplete.common"
import { TranslationService } from "../utilities/translation-service"

import { ThirdPartyCredentials } from "../constants/third-party-credentials"

const googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);

export class MedCentersViewModel extends Observable {

    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;    
    
    // labels
    searchHint: string;
    searchHeader: string;
    search: string;
    listOption: string;
    mapOption: string;
    addressLabel: string;
    phoneNumberLabel: string;

    autocomplete;
    searchText: string;
    suggestedItems: Array<TokenModel>;
    items: ObservableArray<any>;
    @ObservableProperty() visibility1: boolean;
    @ObservableProperty() visibility2: boolean;
    @ObservableProperty() currentLatitude: number;
    @ObservableProperty() currentLongitude: number;
    @ObservableProperty() searchTerm: string;
    @ObservableProperty() city: string;
    @ObservableProperty() country: string;
    
    selectedBarIndex: number;

    constructor(args) {
        super();
        const page = args.object;

        this.items = new ObservableArray<any>();

        this.autocomplete = page.getViewById("autocomplete");
        this.autocomplete.minimumCharactersToSearch = 3;
        let text = this.autocomplete.text;
        this.autocomplete.loadSuggestionsAsync = function (text) {
            return new Promise((resolve, reject) => {
            googlePlacesAutocomplete.search(text, "(cities)")
                .then((places: any) => {
                    const suggestedItems: Array<TokenModel> = new Array<TokenModel>();
        
                    places.forEach(place => suggestedItems.push(new TokenModel(place.description, null)));
                    
                    resolve(suggestedItems);
                }, (error => {
                    reject([]);
                }));
            })
        };

        this.setLabelsAndMessages();
    }

    setLabelsAndMessages():void {
        this.searchHint = TranslationService.localizeValue("searchHint", "med-centers-page", "label");
        this.search = TranslationService.localizeValue("search", "med-centers-page", "label");
        this.mapOption = TranslationService.localizeValue("mapOption", "med-centers-page", "label");
        this.listOption = TranslationService.localizeValue("listOption", "med-centers-page", "label");       
        this.searchHeader = TranslationService.localizeValue("searchHeader", "med-centers-page", "label");      
        this.addressLabel = TranslationService.localizeValue("addressLabel", "med-centers-page", "label");      
        this.phoneNumberLabel = TranslationService.localizeValue("phoneNumberLabel", "med-centers-page", "label");      
    }
}

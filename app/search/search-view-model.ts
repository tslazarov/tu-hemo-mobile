import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { ObservableProperty } from "../shared/observable-property-decorator";
import { TokenModel } from "nativescript-ui-autocomplete";
import { GooglePlacesAutocomplete } from "../nativescript-google-places-autocomplete-forked/google-places-autocomplete.common"
import { TranslationService } from "../utilities/translation-service"

import { ThirdPartyCredentials } from "../constants/third-party-credentials"

const googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);

export class SearchViewModel extends Observable {
    
    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;    
    
    // labels
    searchHint: string;
    searchHeader: string;
    listOption: string;
    mapOption: string;
    bloodTypeLabel: string;
    dateLabel: string;

    autocomplete;
    searchText: string;
    suggestedItems: Array<TokenModel>;
    items: ObservableArray<any>;
    selectedSearchBloodTypes: ObservableArray<number>;
    @ObservableProperty() visibility1: boolean;
    @ObservableProperty() visibility2: boolean;
    @ObservableProperty() currentLatitude: number;
    @ObservableProperty() currentLongitude: number;
    @ObservableProperty() searchTerm: string;
    @ObservableProperty() city: string;
    @ObservableProperty() country: string;
    
    selectedBarIndex: number;
    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]
    
    constructor(args, isPreserveHistory) {
        super();
        const page = args.object;

        this.items = new ObservableArray<any>();
        this.selectedSearchBloodTypes = new ObservableArray<number>();

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
        this.searchHint = TranslationService.localizeValue("searchHint", "search-page", "label");
        this.searchHeader = TranslationService.localizeValue("searchHeader", "search-page", "label");
        this.listOption = TranslationService.localizeValue("listOption", "search-page", "label");       
        this.mapOption = TranslationService.localizeValue("mapOption", "search-page", "label");
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "search-page", "label");        
        this.dateLabel = TranslationService.localizeValue("dateLabel", "search-page", "label");        
    }
}

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
    searchSuggestions: ObservableArray<TokenModel>;
    items: ObservableArray<any>;
    @ObservableProperty() visibility1: boolean;
    @ObservableProperty() visibility2: boolean;
    @ObservableProperty() currentLatitude: number;
    @ObservableProperty() currentLongitude: number;
    
    selectedBarIndex: number;
    bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-" ]

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
                    this.searchSuggestions = new ObservableArray<TokenModel>();
                    
                    if(places.length > 0) {        
                        places.forEach(place => this.searchSuggestions.push(new TokenModel(place.description, null)));
                        
                        resolve(this.searchSuggestions);
                    }
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
        this.bloodTypeLabel = TranslationService.localizeValue("bloodTypeLabel", "request-page", "label");        
        this.dateLabel = TranslationService.localizeValue("dateLabel", "request-page", "label");        
    }
}

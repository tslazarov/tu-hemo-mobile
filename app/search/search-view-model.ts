import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";
// import { GooglePlacesAutocomplete } from '../nativescript-google-places-autocomplete-forked'

import { ThirdPartyCredentials } from "../constants/third-party-credentials"

// let googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);


export class SearchViewModel extends Observable {
    private autocomplete;
    public items = [];

    constructor(args) {
        super();
        const page = args.object;

        this.autocomplete = page.getViewById("autocomplete");
        this.autocomplete.minimumCharactersToSearch = 3;
        let text = this.autocomplete.text;
        // this.autocomplete.loadSuggestionsAsync = function (text) {
        //     return new Promise((resolve, reject) => {
        //     googlePlacesAutocomplete.search(text, "(cities)")
        //         .then((places: any) => {
        //             if(places.length > 0) {
        //                 const items: Array<TokenModel> = new Array();
        
        //                 places.forEach(place => items.push(new TokenModel(place.description, null)));
                        
        //                 resolve(items);
        //             }
        //         }, (error => {
        //             reject([]);
        //         }));
        //     })
        // };
    }

    get dataItems(): ObservableArray<TokenModel> {
        return this.get("_dataItems");
    }

    set dataItems(value: ObservableArray<TokenModel>) {
        this.set("_dataItems", value);
    }
}

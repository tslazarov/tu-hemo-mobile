import { Observable } from "data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { TokenModel } from "nativescript-ui-autocomplete";

export class SearchViewModel extends Observable {
    private autocomplete;
    private countries = ["Australia", "Albania", "Austria", "Argentina" ];

    constructor(args) {
        super();
        const page = args.object;
        this.autocomplete = page.getViewById("autocomplete");
        this.initDataItems();
    }

    get dataItems(): ObservableArray<TokenModel> {
        return this.get("_dataItems");
    }

    set dataItems(value: ObservableArray<TokenModel>) {
        this.set("_dataItems", value);
    }

    private initDataItems() {
        this.dataItems = new ObservableArray<TokenModel>();

        for (let i = 0; i < this.countries.length; i++) {
            this.dataItems.push(new TokenModel(this.countries[i], undefined));
        }
    }
}

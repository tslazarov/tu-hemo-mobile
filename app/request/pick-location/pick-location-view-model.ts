import { Observable } from "tns-core-modules/data/observable/observable";
import { ObservableProperty } from "../../shared/observable-property-decorator";
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"
import { longitudeProperty } from "../../../node_modules/nativescript-mapbox";

export class PickLocationPageViewModel extends Observable {

    mapBoxAPIKey: string = ThirdPartyCredentials.MapboxAPIKey;

    @ObservableProperty() currentLatitude: string;
    @ObservableProperty() currentlongitude: string;
    @ObservableProperty() address: string;
    @ObservableProperty() city: string;
    @ObservableProperty() country: string;
    @ObservableProperty() latitude: string;
    @ObservableProperty() longitude: string;
    @ObservableProperty() selectedBloodType: number;
    @ObservableProperty() bloodQuantity: number;
    @ObservableProperty() isEditMode: boolean;
    @ObservableProperty() id: string;

    constructor() {
        super();
    }
}

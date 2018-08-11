import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";
import { MapboxViewApi, LatLng } from "nativescript-mapbox";
import { GooglePlacesAutocomplete } from "../../nativescript-google-places-autocomplete-forked/google-places-autocomplete.common"

import { PickLocationPageViewModel } from "./pick-location-view-model";

const googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.addCssFile("./request/pick-location/pick-location-page.css");

    page.bindingContext = new PickLocationPageViewModel();
}

export function onMapReady(args) {
    let map = args.map;
    const viewModel = <PickLocationPageViewModel>map.bindingContext;


    geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 })
    .then((response) => {
        map.setCenter({
            lat: viewModel.latitude ? viewModel.latitude : response.latitude,
            lng: viewModel.longitude ? viewModel.longitude : response.longitude,
            animated: true
          });
    });

    map.setOnMapClickListener((point: LatLng) => {
        map.removeMarkers([2]);
        map.addMarkers([
            {
              id: 2,
              lat: point.lat,
              lng: point.lng,
        }]);
        
        console.log(`Map tapped: ${JSON.stringify(point)}`); 
        googlePlacesAutocomplete.getGeolocationByPoint(point.lat, point.lng).then((result) => {
            viewModel.address = result.address;
            viewModel.city = result.city;
            viewModel.country = result.country;
            viewModel.latitude = result.latitude;
            viewModel.longitude = result.longitude;
        });
    });
}

export function fabTapSave(args) {
    let page = args.object.page;
    const viewModel = <PickLocationPageViewModel>page.bindingContext;

    console.log(viewModel.city);
}

import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { ThirdPartyCredentials } from "../../constants/third-party-credentials"
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";
import { MapboxViewApi, LatLng } from "nativescript-mapbox";
import { GooglePlacesAutocomplete } from "../../nativescript-google-places-autocomplete-forked/google-places-autocomplete.common"
import { topmost } from "tns-core-modules/ui/frame/frame";

import { PickLocationPageViewModel } from "./pick-location-view-model";

const googlePlacesAutocomplete = new GooglePlacesAutocomplete(ThirdPartyCredentials.PlacesAPIKey);

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./request/pick-location/pick-location-page.css");

    page.bindingContext = new PickLocationPageViewModel();

    if(typeof context != 'undefined' && context && context.container) {
        page.bindingContext.address = context.container.address;
        page.bindingContext.city = context.container.city;
        page.bindingContext.country = context.container.country;
        page.bindingContext.latitude = context.container.latitude;
        page.bindingContext.longitude = context.container.longitude;
        page.bindingContext.bloodQuantity = context.container.bloodQuantity;
        page.bindingContext.selectedBloodType = context.container.selectedBloodType;
        page.bindingContext.isEditMode = context.container.isEditMode;
        page.bindingContext.id = context.container.id;
    }
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

    if(viewModel.latitude && viewModel.longitude) {
        map.addMarkers([{
            id: 2,
            lat: viewModel.latitude,
            lng: viewModel.longitude,
      }]);
    }

    map.setOnMapClickListener((point: LatLng) => {
        map.removeMarkers([2]);
        map.addMarkers([{
              id: 2,
              lat: point.lat,
              lng: point.lng,
        }]);
         
        googlePlacesAutocomplete.getGeolocationByPoint(point.lat, point.lng).then((result) => {
            viewModel.address = result.address;
            viewModel.city = result.city;
            viewModel.country = result.country;
            viewModel.latitude = result.latitude;
            viewModel.longitude = result.longitude;
        });
    });
}

export function onfabSaveTap(args) {
    const page = args.object.page;
    const viewModel = <PickLocationPageViewModel>page.bindingContext;

    const navigationEntry = {
        moduleName: "request/request-create-edit/request-create-edit-page",
        context: {
            "container": {
                "address": viewModel.address,
                "city": viewModel.city,
                "country": viewModel.country,
                "latitude": viewModel.latitude,
                "longitude": viewModel.longitude,
                "bloodQuantity": viewModel.bloodQuantity,
                "selectedBloodType": viewModel.selectedBloodType,
                "isEditMode": viewModel.isEditMode,
                "id": viewModel.id
            }
        },
        clearHistory: true
    };

    console.log(navigationEntry.context);

    topmost().navigate(navigationEntry);
}

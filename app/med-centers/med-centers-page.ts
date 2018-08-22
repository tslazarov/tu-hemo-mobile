import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { Label } from "ui/label";
import { Button } from "ui/button";
import { View } from "ui/core/view";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost  } from "tns-core-modules/ui/frame/frame";
import { SegmentedBar } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";
import { DateFormatter } from "../utilities/date-formatter";
import { SecureStorage } from "nativescript-secure-storage";
import { ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { fromBase64 } from "image-source";

import { MedCentersViewModel } from "./med-centers-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context: any = page.navigationContext;

    page.addCssFile("./med-centers/med-centers-page.css");

    page.bindingContext = new MedCentersViewModel(args);

    page.bindingContext.visibility1 = true;
    page.bindingContext.visibility2 = false;
    page.bindingContext.selectedBarIndex = 0;

    populateList(page.bindingContext);
}

export function populateList(viewModel: MedCentersViewModel) {
    geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.any, maximumAge: 5000, timeout: 3000 })
    .then((response) => {
        viewModel.currentLatitude = response.latitude;
        viewModel.currentLongitude = response.longitude;

        getItems(0, viewModel.currentLatitude, viewModel.currentLongitude, viewModel.city, viewModel.country)
            .then((response) => {
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "name": item.name,
                            "address": item.address,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "phoneNumber": item.phoneNumber,
                            "image": fromBase64(item.image),
                            "addressLabel": viewModel.addressLabel,
                            "phoneNumberLabel": viewModel.phoneNumberLabel
                        });
                    });
                }
            }, (reject) => {
        });
    });
}

export function getItems(skip: number, latitude, longitude, city, country): Promise<any> {
    return new Promise<any>(
        (resolve, reject) => {
            let url = `${APIConstants.Domain}/${APIConstants.MedCentersGetListFullEndpoint}?skip=${skip}&take=5`;
            
            url += latitude ? `&latitude=${latitude}` : "";
            url += longitude ? `&longitude=${longitude}&inRange=true` : "";
            url += city ? `&city=${city}` : "";
            url += country ? `&country=${country}` : "";

            HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
            .then((response) => {
                const result = response.content.toJSON();
                resolve(result);
            }, (reject) => {
                reject(reject);
            });
        }
    );
}

export function onLoadMoreItemsRequested(args: ListViewEventData) {
    const page = <Page>args.object.page;
    let viewModel = <MedCentersViewModel>page.bindingContext;

    const that = new WeakRef(this);
    setTimeout(function () {
        const listView: RadListView = args.object;
        
        getItems(viewModel.items.length, viewModel.currentLatitude, viewModel.currentLongitude, viewModel.city, viewModel.country)
            .then((response) => {
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "name": item.name,
                            "address": item.address,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "phoneNumber": item.phoneNumber,
                            "image": fromBase64(item.image),
                            "addressLabel": viewModel.addressLabel,
                            "phoneNumberLabel": viewModel.phoneNumberLabel
                        });
                    });
                }
                else {
                    listView.loadOnDemandMode = ListViewLoadOnDemandMode[ListViewLoadOnDemandMode.None];
                }
            }, (reject) => {

            });

        listView.notifyLoadOnDemandFinished();
    }, 1000);
    args.returnValue = true;
}

export function onOpenDrawerTap() {
    let sideDrawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("sideDrawer"));
    sideDrawer.showDrawer();
}

export function onCloseDrawerTap() {
    let sideDrawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("sideDrawer"));
    sideDrawer.closeDrawer();
}

export function onSbLoaded(args) {

    const segmentedBarComponent = args.object;
    segmentedBarComponent.on("selectedIndexChange", (sbargs) => {
        let segmentedBar = <SegmentedBar>sbargs.object;
        this.selectedIndex = segmentedBar.selectedIndex;
        let viewModel = <MedCentersViewModel>segmentedBar.page.bindingContext;

        switch (this.selectedIndex) {
            case 0:
                viewModel.visibility1 = true;
                viewModel.visibility2 = false;
                break;
            case 1:
                viewModel.visibility1 = false;
                viewModel.visibility2 = true;
                break;
            default:
                break;
        }
    })
}

export function onMapReady(args) {
    let map = args.map;
    const viewModel = <MedCentersViewModel>map.bindingContext;

    geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 })
    .then((response) => {
        map.setCenter({
            lat: response.latitude,
            lng: response.longitude,
            animated: true
          });
    });

    updateMapMarkers(viewModel, map, false);
}

export function updateMapMarkers(viewModel: MedCentersViewModel, map, searchable) {
    map.removeMarkers();

    viewModel.items.forEach((item, index) => {
        if(searchable && index == 0){

            map.setCenter({
                lat: item.latitude,
                lng: item.longitude,
                animated: true
              });
        }
        map.addMarkers([
            {
              id: item.index,
              lat: item.latitude,
              lng: item.longitude,
              title: item.name,
              subtitle: `${viewModel.addressLabel}${item.address}\n${viewModel.phoneNumberLabel}${item.phoneNumber}`,
              onCalloutTap: function(marker){
                  callDetailPage(item.id, viewModel);
              }
            }]
    )});
}

export function callDetailPage(id:string, viewModel: MedCentersViewModel)
{
    const navigationEntry = {
        moduleName: "med-centers/med-centers-detail/med-centers-detail-page",
        context: {
            "id": id,
            "wrappedMaster": viewModel,
        },
        clearHistory: true
    };

    topmost().navigate(navigationEntry);
}

export function onSearchTap(args: EventData): void { 
    const view = <View>args.object;
    const page = view.page;
    const button = <Button>args.object;
    const viewModel = <MedCentersViewModel>button.bindingContext;

    viewModel.currentLatitude = null;
    viewModel.currentLongitude = null;

    const re = /,\s/g; 

    let concatenatedSearchTerm = viewModel.searchTerm ? viewModel.searchTerm.replace(re, ",") : ""; 

    let cityAndCountry = concatenatedSearchTerm.split(",");

    if(cityAndCountry.length > 1) {
        viewModel.city = cityAndCountry[0];
        viewModel.country = cityAndCountry[cityAndCountry.length - 1];
    }


    let sideDrawer: RadSideDrawer = <RadSideDrawer>(topmost().getViewById("sideDrawer"));
    sideDrawer.closeDrawer();

    getItems(0, viewModel.currentLatitude, viewModel.currentLongitude, viewModel.city, viewModel.country)
            .then((response) => {
                viewModel.items.splice(0);
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "name": item.name,
                            "address": item.address,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "phoneNumber": item.phoneNumber,
                            "image": fromBase64(item.image),
                            "addressLabel": viewModel.addressLabel,
                            "phoneNumberLabel": viewModel.phoneNumberLabel
                        });
                    });

                    let listView = <RadListView>page.getViewById("listItems");   
                    listView.loadOnDemandMode = ListViewLoadOnDemandMode[ListViewLoadOnDemandMode.Auto];
                }

                let map = page.getViewById("mapView"); 
                updateMapMarkers(viewModel, map, true);
            }, (reject) => {
    });
}

export function onItemTap(args) {
    const viewModel = <MedCentersViewModel>args.object.page.bindingContext;
    callDetailPage(args.object.id, viewModel);
}

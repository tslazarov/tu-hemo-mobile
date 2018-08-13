import { EventData } from "tns-core-modules/data/observable/observable";
import { Page } from "tns-core-modules/ui/page/page";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { topmost  } from "tns-core-modules/ui/frame/frame";
import { SegmentedBar, SegmentedBarItem } from "tns-core-modules/ui/segmented-bar/segmented-bar";
import { APIConstants } from "../constants/api-endpoints";
import { HttpClient } from "../utilities/http-client";
import { ThirdPartyCredentials } from "../constants/third-party-credentials";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums/enums";
import { DateFormatter } from "../utilities/date-formatter";
import { SecureStorage } from "nativescript-secure-storage";
import { ListViewEventData, RadListView, ListViewLoadOnDemandMode } from "nativescript-ui-listview";
import { fromBase64 } from "image-source";

import { SearchViewModel } from "./search-view-model";

const secureStorage = new SecureStorage();

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.addCssFile("./search/search-page.css");

    page.bindingContext = new SearchViewModel(args);

    page.bindingContext.visibility1 = true;
    page.bindingContext.visibility2 = false;
    page.bindingContext.selectedBarIndex = 0;

    populateList(page.bindingContext);
}

export function populateList(viewModel: SearchViewModel) {
    console.log('populate');
    geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.any, maximumAge: 5000, timeout: 3000 })
    .then((response) => {
        viewModel.currentLatitude = response.latitude;
        viewModel.currentLongitude = response.longitude;

        getItems(0, viewModel.currentLatitude, viewModel.currentLongitude, null, null)
            .then((response) => {
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "bloodType": viewModel.bloodTypes[item.bloodType], 
                            "name": item.name,
                            "address": item.address,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "image": fromBase64(item.image),
                            "date": DateFormatter.toDate(item.date),
                            "dateLabel": viewModel.dateLabel,
                            "bloodTypeLabel": viewModel.bloodTypeLabel
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
            let url = `${APIConstants.Domain}/${APIConstants.RequestsGetListFullEndpoint}?skip=${skip}&take=5`;
            
            url += latitude ? `&latitude=${latitude}` : "";
            url += longitude ? `&longitude=${longitude}&inRange=true` : "";
            url += city ? `&city=${city}` : "";
            url += country ? `&country=${country}` : "";


            HttpClient.getRequest(url, secureStorage.getSync({key: "access_token" }))
            .then((response) => {
                const result = response.content.toJSON();
                console.log(result);
                resolve(result);
            }, (reject) => {
                reject(reject);
            });
        }
    );
}

export function onLoadMoreItemsRequested(args: ListViewEventData) {
    const page = <Page>args.object.page;
    let viewModel = <SearchViewModel>page.bindingContext;

    const that = new WeakRef(this);
    setTimeout(function () {
        const listView: RadListView = args.object;
        
        getItems(viewModel.items.length, viewModel.currentLatitude, viewModel.currentLongitude, null, null)
            .then((response) => {
                if (response && response.length > 0) {
                    response.forEach(item => {
                        viewModel.items.push({ 
                            "id": item.id, 
                            "bloodType": viewModel.bloodTypes[item.bloodType], 
                            "name": item.name,
                            "address": item.address,
                            "latitude": item.latitude,
                            "longitude": item.longitude,
                            "image": fromBase64(item.image),
                            "date": DateFormatter.toDate(item.date),
                            "dateLabel": viewModel.dateLabel,
                            "bloodTypeLabel": viewModel.bloodTypeLabel
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
        let viewModel = <SearchViewModel>segmentedBar.page.bindingContext;

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

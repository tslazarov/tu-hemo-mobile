import { Observable } from 'tns-core-modules/data/observable/observable';
import { PLACES_API_URL, PLACES_DETAILS_API_URL_places, GEOCODE_URL_geocode } from './google-places-autocomplete.static';
import * as app from 'tns-core-modules/application/application';
import * as dialogs from 'tns-core-modules/ui/dialogs/dialogs';
import * as http from 'tns-core-modules/http/http';

export class GooglePlacesAutocomplete extends Observable {
  private apikey: string;
  constructor(key: string) {
    super();
    this.apikey = key;
  }
  public search(terms: string, type:string) {
    let placeType = type ? type : 'geocode';
    
    let requestUrl = PLACES_API_URL +
      "?input=" + encodeURIComponent(terms.trim()) +
      "&types=" + encodeURIComponent(placeType.trim()) + "&key=" +
      this.apikey;
    return http
      .getJSON(requestUrl)
      .then(function (data: any) {
        let items = []
        for (let i = 0; i < data.predictions.length; i++) {
          items.push({
            description: data.predictions[i].description,
            placeId: data.predictions[i].place_id,
            data: data.predictions[i]
          })
        }
        return items
      })
  }
  public getPlaceById(placeId: any) {
    let requestUrl = PLACES_DETAILS_API_URL_places +
      "?placeid=" + placeId + "&key=" +
      this.apikey;
    return http
      .getJSON(requestUrl)
      .then((data: any) => {
        let place: any = {}
        place.latitude = data.result.geometry.location.lat
        place.longitude = data.result.geometry.location.lng
        place.name = data.result.name
        place.phoneNumber = data.result.international_phone_number
        place.formattedAddress = data.result.formatted_address
        place.data = data;
        if (data.result.photos && data.result.photos.length > 0) {
          place.photoReference = data.result.photos[0].photo_reference
        }
        return place
      })
  }

  public getGeolocationByPoint(latitude: any, longtitude: any) {
    let requestUrl = GEOCODE_URL_geocode +
      "?latlng=" + latitude + "," + longtitude + "&key=" +
      this.apikey;
    return http
      .getJSON(requestUrl)
      .then((data: any) => {
        let place: any = {};
        
        if(data.results && data.results.length > 0)
        {
          let addressComponents = data.results[0].address_components;
          
          if(addressComponents && addressComponents.length > 0) {
            addressComponents.forEach(element => {
              element.types.forEach(type => {
                if(type == "locality") {
                  place.city = element.long_name;
                } 
                else if(type == "country") {
                  place.country = element.long_name;
                }
              })
            });
          }

          place.address = data.results[0].formatted_address;
          place.latitude = latitude;
          place.longitude = longtitude;
        }
        return place;
      });
  }


  private handleErrors(response) {
    if (!response.result) {
      console.log("google-geocoder error")
      console.log(JSON.stringify(response));
    }
    return response;
  }
}

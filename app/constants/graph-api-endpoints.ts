export class GraphAPIConstants {
    static readonly Domain : string = "https://graph.facebook.com/v3.0";
    static readonly MeEndpoint : string = "me?scope=email&access_token=";
    static readonly PictureEndpoint : string = "picture?type=large&redirect=false&access_token=";
    static readonly FieldsEndpoint : string = "?fields=email,first_name,last_name,name&access_token=";
}
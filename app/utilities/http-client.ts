const httpModule = require("http");

export class HttpClient {

    static getRequest(url:string,token:string): Promise<any> {
        return httpModule.request({
            url: url,
            method: "GET",
            headers: token ? { "Authorization": `Bearer ${token}` } : {},
        });
    }

    static postRequest(url:string, content:any, token:string, contentType:string): Promise<any> {
        return new Promise<any>(
            function(resolve, reject) {
                httpModule.request({
                    url: url,
                    method: "POST",
                    headers: token ? { "Content-Type": contentType, "Authorization": `Bearer ${token}` } : { "Content-Type": contentType },
                    content: content
                })
                .then((response) => {
                    resolve(response);
                }, (error) => {
                    reject(error);
                });
            }
        ); 
    }

    static putRequest(url:string, content:any, token:string, contentType:string): Promise<any> {
        return new Promise<any>(
            function(resolve, reject) {
                httpModule.request({
                    url: url,
                    method: "PUT",
                    headers: token ? { "Content-Type": contentType, "Authorization": `Bearer ${token}` } : { "Content-Type": contentType },
                    content: content
                })
                .then((response) => {
                    resolve(response);
                }, (error) => {
                    reject(error);
                });
            }
        );
    }
}
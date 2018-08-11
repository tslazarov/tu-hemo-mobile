import { ImageSource } from "image-source";
import * as imagepicker from "nativescript-imagepicker";
import { PhotoEditor, PhotoEditorControl } from "nativescript-photo-editor";

const imageSourceModule = require("tns-core-modules/image-source");
const BitmapFactory = require("nativescript-bitmap-factory");

const photoEditor = new PhotoEditor();


export class PhotoUploader {
    static selectImage(): Promise<ImageSource> {
        return new Promise<ImageSource>(
            (resolve, reject) => {
                let context = imagepicker.create({ mode: "single" });
                
                context
                    .authorize()
                    .then(() => {
                        return context.present();
                    })
                    .then((selection) => {
                        let selectedImage = selection.length > 0 ? selection[0] : null;
                        
                        if(selectedImage) {
                            imageSourceModule.fromAsset(selectedImage).then((imageSource: ImageSource) => {
            
                                photoEditor.editPhoto({
                                    imageSource: imageSource,
                                    hiddenControls: [
                                        PhotoEditorControl.Draw,
                                        PhotoEditorControl.Text,
                                        PhotoEditorControl.Clear
                                    ],
                                }).then((newImage: ImageSource) => {
                
                                    let mutableImage = BitmapFactory.makeMutable(newImage);
                
                                    var bmp = BitmapFactory.create(newImage.width, newImage.height);
                
                                    bmp.dispose(function(b) {
                                        b.insert(mutableImage);
                                        console.log('resize');
                                        let b2 = b.resizeMax(300);
                                        let resizedImage = b2.toImageSource();
                
                                        console.log( resizedImage.width + "x" + resizedImage.height );
            
                                        resolve(resizedImage);
                                    });
                                }).catch((e) => {
                                    reject(e);
                                });
                            }).catch(function (e) {
                                reject(e);
                            })
                        }
                    });
            }
        );
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseMessage } from "../support/response-message";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private base_url = 'http://localhost:8080/images';

  constructor(private http: HttpClient){}

  // POST

  public uploadImage(image: number[], fileName: string){
    return this.http.post<ResponseMessage>(this.base_url+'?fileName='+fileName, image);
  }

  // GET

  public findImageById(imageId: string){
    return this.http.get<ResponseMessage>(this.base_url+'?imageId='+imageId);
  }

}

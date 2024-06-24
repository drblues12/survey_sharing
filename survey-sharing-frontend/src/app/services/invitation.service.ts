import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ResponseMessage } from "../support/response-message";
import { Invitation } from "../entities/invitation";

@Injectable({
  providedIn: 'root'
})
export class InvitationService{

  private base_url = "http://localhost:8080/invitations";

  constructor(private http:HttpClient) { }

  // POST

  public createInvitations(surveyTitle: string, invitations: Invitation[]){
    return this.http.post<ResponseMessage>(this.base_url+'?surveyTitle='+surveyTitle,invitations);
  }

  // GET

  public findAllInvitations(user: string){
    return this.http.get<ResponseMessage>(this.base_url+'/'+user);
  }

  public findInvitationById(invitationId: string){
    return this.http.get<ResponseMessage>(this.base_url+'?invitationId='+invitationId);
  }

  // DELETE

  public deleteInvitation(user: string, invitation: string){
    return this.http.delete<ResponseMessage>(this.base_url+'/'+user+'?invitation='+invitation);
  }

  // PUT

  public updateInvitation(user: string, invitation: string, accepted: boolean){
    return this.http.put<ResponseMessage>(this.base_url+'/'+user+'?invitation='+invitation+'&accepted='+accepted,null);
  }

}

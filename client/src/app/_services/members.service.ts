import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';




@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMembers(){
    //console.log(JSON.parse(localStorage.getItem('user') ||'{}').token)
   
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username : string){
    return this.http.get<Member>(this.baseUrl +'users/' + username);
  }
}
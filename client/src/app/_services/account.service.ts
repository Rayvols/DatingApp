import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

baseUrl = environment.apiUrl;
private currentUserSource = new ReplaySubject<User>(1);
currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model :any)
  {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User)=>{
        const user = response;
        if (user){
          this.setCurrentUser(user);
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
      })
    
    )
    
  }

  register(model: any){
    return this.http.post<User>(this.baseUrl+'account/register', model).pipe(
      map((user: User) =>{
        if(user){
          this.setCurrentUser(user);
          // localStorage.setItem('user', JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
        //return user; // чтоб увидеть в консоле че за юзер
      })
    )
  }

  setCurrentUser(user?: User){
    localStorage.setItem('user',JSON.stringify(user));

    this.currentUserSource.next(user);
  }


  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);


  }
}

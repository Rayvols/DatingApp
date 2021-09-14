import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Dating app!';
  users: any;

  constructor( private accountService : AccountService) {}

  ngOnInit() {
   // this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    let userString = localStorage.getItem('user');
    if(userString){
       let user =  JSON.parse(userString);
       if(user){
        this.accountService.setCurrentUser(user);
        return
       }
    }

    this.accountService.setCurrentUser(undefined);
  
  }

  // getUsers(){   //получение юзера
  //   this.http.get('https://localhost:5001/api/users').subscribe(response => {
  //     this.users = response;
  //   }, error => {
  //     console.log(error);
  //   })
  // }
}

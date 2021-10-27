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
    if(userString && userString!="undefined"){
       let user: User =  JSON.parse(userString);
       if(user){
        this.accountService.setCurrentUser(user);
        return
       }
    }

    this.accountService.setCurrentUser(this.users);
  
  }
}

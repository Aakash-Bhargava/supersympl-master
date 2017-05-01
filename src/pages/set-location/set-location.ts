import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { MapPage } from '../map/map';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})
export class SetLocationPage {
  currentUser = <any>{};
  classes = <any>[];

  className: any;
  startTime: any;
  endTime: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private apollo: Angular2Apollo) {
    this.currentUserInfo().then(({data})=>{
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.classes = this.currentUser.sections;
    })

  }

  //Gets user info using graphcool token for authentication
  currentUserInfo(){
      return this.apollo.query({
        query: gql`
          query{
            user{
              id
              firstName
              lastName
              sections{
                id
                sectionNumber
                courseName
                type
                icon
                professor{
                  name
                }
              }
            }
          }
        `
      }).toPromise();
    }

  cancel() {
    this.viewCtrl.dismiss();
  }

  next() {
    this.navCtrl.push(MapPage);
  }

  selectClass(name) {
    this.className = name;
  }

  setPin() {
    let c = {name: this.className, startTime: this.startTime, endTime: this.endTime};
    //this.navCtrl.push(MapPage, {class: c});
    this.viewCtrl.dismiss(c);
  }

  displayFriends() {
    //this.navCtrl.push(FriendsListPage, {
    //});
  }
}

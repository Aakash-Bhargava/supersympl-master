import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';
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
  location: "";

  className: any;
  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  startTime: String = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);
  endTime: String = (new Date(Date.now() - this.tzoffset + (60*60*1000))).toISOString().slice(0,-1);

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private apollo: Angular2Apollo, private alertCtrl: AlertController) {
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
    if (this.startTime >= this.endTime) {
      let alert = this.alertCtrl.create({
        title: 'Hey! You can\'t do this! ',
        subTitle: 'End time needs to be after start time.',
        buttons: ['Dismiss']
      });
      alert.present();
    } else {
      // console.log(this.location);
      let c = {name: this.className, location: this.location, startTime: this.startTime, endTime: this.endTime};
      // console.log(c);
      // this.navCtrl.push(MapPage, {class: c});
      this.viewCtrl.dismiss(c);
    }
  }

  displayFriends() {
    //this.navCtrl.push(FriendsListPage, {
    //});
  }
}

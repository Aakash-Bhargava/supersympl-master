import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

//Graphcool
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'page-studygroup',
  templateUrl: 'studygroup.html',
})
export class StudygroupPage {

  studygroup: any;
  userId: any;

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public navParams: NavParams, public viewCtrl: ViewController) {
    this.studygroup = navParams.get('location');
    this.getuserId().then(({data}) => {
      this.userId = data;
      this.userId = this.userId.user.id;
    })
  }

  close() {
    this.viewCtrl.dismiss();
  }

  join() {
    this.apollo.mutate({
      mutation: gql`
      mutation addToMapPinsOnUser($usersUserId: ID!, $mapPinsMapPinsId: ID!){
        addToMapPinsOnUser(usersUserId:$usersUserId,mapPinsMapPinsId:$mapPinsMapPinsId){
          mapPinsMapPins {
            id
          }
        }
      }
      `,variables:{
        usersUserId: this.userId,
        mapPinsMapPinsId: this.studygroup.id
      }
    }).toPromise();
  }

  getuserId() {
    return this.apollo.query({
      query: gql`
        query {
          user{
            id
          }
        }
      `
    }).toPromise();
  }
}

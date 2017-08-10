import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

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
  isPresent: boolean = false;
  isMaster: boolean = false;

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public toast: ToastController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.studygroup = navParams.get('location');
    console.log(this.studygroup);
    this.getuserId().then(({data}) => {
      this.userId = data;
      this.userId = this.userId.user.id;
      if (this.userId == this.studygroup.users[0].id) {
        this.isMaster = true;
      }
      for (let user of this.studygroup.users) {
        if (user.id == this.userId) {
          this.isPresent = true;
          break;
        }
      }
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
    }).toPromise().then(({data}) => {
      let toast = this.toast.create({
        message: 'Joined study group!',
        position: 'top',
        duration: 3000
      });
      toast.present();
      this.viewCtrl.dismiss();
    });
  }

  leave() {
    this.apollo.mutate({
      mutation: gql`
      mutation removeFromMapPinsOnUser($usersUserId: ID!, $mapPinsMapPinsId: ID!){
        removeFromMapPinsOnUser(usersUserId:$usersUserId,mapPinsMapPinsId:$mapPinsMapPinsId){
          mapPinsMapPins {
            id
          }
        }
      }
      `,variables:{
        usersUserId: this.userId,
        mapPinsMapPinsId: this.studygroup.id
      }
    }).toPromise().then(({data}) => {
      let toast = this.toast.create({
        message: 'Left study group!',
        position: 'top',
        duration: 3000
      });
      toast.present();
      this.viewCtrl.dismiss();
    });
  }

  delete() {
    this.apollo.mutate({
      mutation: gql`
      mutation deleteMapPins($id: ID!){
        deleteMapPins(id:$id){
           id
        }
      }
      `,variables:{
        id: this.studygroup.id
      }
    }).toPromise().then(({data}) => {
      let toast = this.toast.create({
        message: 'Deleted study group!',
        position: 'top',
        duration: 3000
      });
      toast.present();
      this.viewCtrl.dismiss();
    });

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

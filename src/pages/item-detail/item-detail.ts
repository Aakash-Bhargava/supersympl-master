import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import { ProfilePage } from '../profile/profile';

import gql from 'graphql-tag';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})




export class ItemDetailPage {
  classInfo: string = "professor";
  section: any;
  users = <any>[];
  events = <any>[];

  currentUser : any;

  pastEvents = <any>[];

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     public alertCtrl: AlertController,
                     private apollo: Angular2Apollo) {

    this.section = navParams.get('section');
    this.currentUser = navParams.get('user');
    this.users = this.section.users;
    let now = new Date().toISOString();



    for (let event of this.section.events) {
      if (event.dueDate < now) {
        if (this.pastEvents.length < 3) {
          this.pastEvents.push(event);
        }
      } else {
        this.events.push(event);
      }
    }
  }

  gotoUser(user) {
    this.navCtrl.push(ProfilePage, {user: user});
  }

  /**
   * Delete an item from the list of items.
   */
   showDropAlert() {
     let confirm = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'You can always add it again later.',
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log('Disagree clicked');

            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.apollo.mutate({

               mutation: gql`
               mutation removeFromUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
                 removeFromUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
                   sectionsSection {
                     id
                   }
                 }
               }
               `,variables:{
                 usersUserId: this.currentUser.id,
                 sectionsSectionId: this.section.id
               }
             }).toPromise();
             this.navCtrl.pop();
            }
          }
        ]
      });
      confirm.present();
   }
}

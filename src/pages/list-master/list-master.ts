import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController} from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';

import { SearchPage } from '../search/search';
// import { Items } from '../../providers/providers';
// import { Item } from '../../models/item';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  today: any;
  meetsToday = false;
  currentUser = <any>{};
  sections = <any>[];
  sectionsData = <any>[];
  section: any;
  data: any;
  now = new Date().toISOString();
  constructor(public navCtrl: NavController, //public items: Items,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo ) {
  }

  ionViewDidEnter() {
    this.today = new Date().toDateString();
    this.today = this.today.split(' ')[0];
    console.log(this.today);

    this.refreshData();
  }

  refreshData() {
    this.data = this.watch();
    this.data.refetch().then(({data}) => {
      this.sectionsData = [];
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.sections = this.currentUser.sections;
      for(let section of this.sections){
        switch(this.today) {
          case "Mon": {
            if(section.monday){
              this.meetsToday = true;
            }
            break;
           }
           case "Tue": {
             if(section.tuesday){
               this.meetsToday = true;
             }
             break;
           }
           case "Wed": {
             if(section.wednesday){
               this.meetsToday = true;
             }
              break;
           }
           case "Thu": {
             if(section.thursday){
               this.meetsToday = true;
             }
              break;
           }
           case "Fri": {
             if(section.friday){
               this.meetsToday = true;
             }
              break;
           }
           default: {
              console.log("Invalid choice");
              break;
           }
        }
        this.sectionsData.push({section: section, meetsToday: this.meetsToday})
        console.log(this.sectionsData);
        this.meetsToday = false;
      }
      // this.section = this.sections.sectionNumber;
    });
  }

  doRefresh(refresher) {
    this.refreshData();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  watch() {
    return this.apollo.watchQuery({
      query: gql`
        query{
          user{
            id
            email
            firstName
            lastName
            phone
            email
            major
            year
            profilePic
            sections{
              id
              sectionNumber
              courseName
              type
              icon
              monday
              tuesday
              wednesday
              thursday
              friday
              users {
                id
                email
                firstName
                lastName
                phone
                email
                major
                year
                profilePic
                sections {
                  courseName
                }
              }
              professor{
                name
                email
              }
              events {
                description
                dueDate
                dueTime
                title
              }
            }
          }
        }
      `
    });
  }

  //Gets user info using graphcool token for authentication
  currentUserInfo(){
      return this.apollo.query({
        query: gql`
          query{
            user{
              id
              email
              firstName
              lastName
              phone
              email
              major
              year
              profilePic
              sections{
                id
                sectionNumber
                courseName
                type
                icon
                monday
                tuesday
                wednesday
                thursday
                friday
                users {
                  id
                  email
                  firstName
                  lastName
                  phone
                  email
                  major
                  year
                  profilePic
                  sections {
                    courseName
                  }
                }
                professor{
                  name
                  email
                }
                events {
                  description
                  dueDate
                  dueTime
                  title
                }
              }
            }
          }
        `
      }).toPromise();
    }

  addItem() {
    this.navCtrl.push(SearchPage);
  }

  /**
   * Delete an item from the list of items.
   */
   removeSection(section) {
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
                 sectionsSectionId: section.id
               }
             }).toPromise();

             this.refreshData();
            }
          }
        ]
      });
      confirm.present();
   }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(section) {
    this.navCtrl.push(ItemDetailPage, {
      section: section
    });
  }

  moreInfo() {
    let alert = this.alertCtrl.create({
      title: 'What is this page?',
      subTitle: 'This page allows the user to navigate through their classes every semester.',
      buttons: ['Dismiss']
    });
    alert.present()
  }

}

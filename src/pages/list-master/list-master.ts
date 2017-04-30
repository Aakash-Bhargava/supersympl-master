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
  currentUser = <any>{};
  sections = <any>[];
  section: any;
  data: any;
  constructor(public navCtrl: NavController, //public items: Items,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo ) {
  }

  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.sections = this.currentUser.sections;
      this.section = this.sections.sectionNumber;
      console.log(this.currentUser);
    });
  }

  refreshData() {
    this.data = this.watch();
    this.data.refetch().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.sections = this.currentUser.sections;
      this.section = this.sections.sectionNumber;
      // console.log(this.currentUser.sections);
    });
  }

  doRefresh(refresher) {
    this.data = this.watch();
    this.data.refetch().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.sections = this.currentUser.sections;
      this.section = this.sections.sectionNumber;
      // console.log(this.currentUser.sections);
    });
    setTimeout(() => {
      // console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  watch() {
    return this.apollo.watchQuery({
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
    });
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

  addItem() {
    this.navCtrl.push(SearchPage);
  }

  /**
   * Delete an item from the list of items.
   */
   removeSection(section) {
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

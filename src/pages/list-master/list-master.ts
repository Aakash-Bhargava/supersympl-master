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
  courses = <any>[];
  course: any;
  constructor(public navCtrl: NavController, //public items: Items,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo ) {
  }

  //
  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.courses = this.currentUser.courses
      this.course = this.courses.course
      console.log(this.currentUser.courses);
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
              courses{
                id
                name
                icon
                type
              }
            }
          }
        `
      }).toPromise();
    }

  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
  this.navCtrl.push(SearchPage);
  }

  /**
   * Delete an item from the list of items.
   */
  // deleteItem(item) {
  //   this.items.delete(item);
  // }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(course) {
    this.navCtrl.push(ItemDetailPage, {
      course: course
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

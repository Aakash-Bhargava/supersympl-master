import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController} from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';

import { SearchPage } from '../search/search';
import { Items } from '../../providers/providers';
import { Item } from '../../models/item';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController ) {
    this.currentItems = this.items.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
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
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
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

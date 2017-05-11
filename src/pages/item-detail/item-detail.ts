import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Items } from '../../providers/providers';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})




export class ItemDetailPage {
  classInfo: string = "professor";
  section: any;
  users = <any>[];
  //name: string;
  //email: string;

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     items:   Items,
                     private apollo: Angular2Apollo) {

    this.section = navParams.get('section') || items.defaultItem;
    this.users = this.section.users;
    console.log(this.users);
  }


}

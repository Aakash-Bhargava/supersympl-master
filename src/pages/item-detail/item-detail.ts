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
  course: any;
  //name: string;
  //email: string;

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     items:   Items,
                     private apollo: Angular2Apollo) {

    this.course = navParams.get('course') || items.defaultItem;
  }


}

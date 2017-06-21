import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
  events = <any>[];

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     private apollo: Angular2Apollo) {

    this.section = navParams.get('section');
    this.users = this.section.users;
    this.events = this.section.events;
  }



}

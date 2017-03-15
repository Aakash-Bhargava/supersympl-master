import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Items } from '../../providers/providers';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription';

import gql from 'graphql-tag';


const allSections = gql`
  query allSections{
    name
  }
`;


@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})




export class ItemDetailPage implements OnInit {
  // item: any;
  classInfo: string = "professor";

  name: string;
  // email: string;

  constructor(public navCtrl: NavController,
                     navParams: NavParams,
                     items:   Items,
                     private apollo: Angular2Apollo) {

    // this.item = navParams.get('item') || items.defaultItem;
  }

  ngOnInit() {
    this.apollo.watchQuery({
      query: allSections
    }).subscribe(({data}) => {
      this.name = name;
      // this.email = data.email;
    });
  }
}

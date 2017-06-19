import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, ToastController } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
// import { Items } from '../../providers/providers';
// import { Item } from '../../models/item';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  allSectionsData = <any>{};
  allSections = <any>[];
  queryList = <any>[];
  userId: any;
  // section: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              // public items: Items
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo,
              public viewCtrl: ViewController,
              public toast: ToastController) {}


  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.allSections = data;
      this.userId = this.allSections.user.id;
      this.allSections = this.allSections.allSections;
    });
  }

  //Gets user info using graphcool token for authentication
  currentUserInfo(){
      return this.apollo.query({
        query: gql`
        query{
          user{
            id
          }
          allSections{
            id
            courseName
            sectionNumber
            type
            professor {
              name
            }
            users{
              id
            }
          }
        }
        `
      }).toPromise();
    }


  initializeItems(): void {
    this.queryList = this.allSections;
    console.log(this.queryList);
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.queryList = [];
      return;
    }

    this.queryList = this.queryList.filter((v) => {
      if(v.courseName && q) {
        if (v.courseName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          for (let user of v.users) {
            if (user.id == this.userId) {
              return false;
            }
          }
          return true;
        }
        return false;
      }
    });

    console.log(q, this.queryList.length);
  }

  listSections(course) {
    // this.sectionList = course.sections;

    console.log(course.sections);
  }

  addToUser(course) {
    this.apollo.mutate({
      mutation: gql`
      mutation addToUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
        addToUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
          sectionsSection {
            id
          }
        }
      }
      `,variables:{
        usersUserId: this.userId,
        sectionsSectionId: course.id
      }
    }).toPromise();

    let toast = this.toast.create({
      message: 'Class Added!',
      position: 'top',
      duration: 3000
    });
    toast.present();

    this.viewCtrl.dismiss();
  }
}

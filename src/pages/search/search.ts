import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

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
  allCourseData = <any>{};
  allCourses = <any>[];
  queryList = <any>[];
  // course: any;
   sectionList=<any>[];
   userId: any;
  // section: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              // public items: Items
              public alertCtrl: AlertController,
              private apollo: Angular2Apollo) {}


  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.allCourseData = data;
      this.allCourses = this.allCourseData.allCourses;
      this.userId = this.allCourseData.user.id;
      console.log(this.allCourses);
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
          allCourses{
            id
            name
            type
          	sections{
              sectionNumber
              professor{
                name
              }
            }
          }
        }
        `
      }).toPromise();
    }


  initializeItems(): void {
    this.queryList = this.allCourses;
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
    return;
  }

  this.queryList = this.queryList.filter((v) => {
    if(v.name && q) {
      if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    }
  });

  console.log(q, this.queryList.length);

}
  //  getItems(ev) {
  //   this.initializeItems()
  //   let val = ev.target.value;
  //   if(!val || !val.trim()) {
  //     this.allCourses = [];
  //     return;
  //   }
  //   this.allCourses = this..name.query({
  //     name: val
  //   });
  // }
  //
  // /**
  //  * Navigate to the detail page for this item.
  //  */
  listSections(course) {
    this.sectionList = course.sections;

    console.log(course.sections)
  }

  addSection(section){
    // return this.apollo.mutate({
    //
    //   mutation: gql`
    //   mutation addToUserOnSection($usersUserId: ID!, $sectionsSectionId: ID!){
    //     addToUserOnSection(usersUserId:$usersUserId,sectionsSectionId:$sectionsSectionId){
    //       sectionsSection {
    //         id
    //       }
    //     }
    //   }
    //   `,variables:{
    //     usersUserId: this.userId,
    //     sectionsSectionId: section.id
    //   }
    // }).toPromise();
    console.log(section);
  }
}

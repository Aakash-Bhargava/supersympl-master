import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsPage } from '../settings/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';
/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

    userInfo = <any>{};
    user = <any>{};
    email = "";
    password = "";
    firstName = "";
    lastName = "";
    major = "";
    phone = "";
    year = "";
    sections: any[];

   settingsMode: string = "profile";

   // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'PROFILE_PAGE'
  };

  page: string = 'main';
  pageTitleKey: string = 'Profile';
  pageTitle: string;

  //subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              private alertCtrl: AlertController,
              private apollo: Angular2Apollo) {}


  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.setUser();
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

  }

  //goToSettingsPage
  goToSettingsPage() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(SettingsPage);
  }

  newGroupPrompt() {
      let alert = this.alertCtrl.create({
      title: 'New Group',
      inputs: [
        {
          name: 'groupName',
          placeholder: 'Group Name'
        }
      ],
      buttons: [
        {
          text: 'Add',
          role: 'add',
          handler: data => {
            console.log('Add clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
      ]
      });
      alert.present();
  }

  setUser(){
   this.checkUserInfo().then(({data}) => {
     if (data){
       this.userInfo = data;
       this.user = this.userInfo.user;
       this.email = this.user.email;
       this.firstName = this.user.firstName;
       this.lastName = this.user.lastName;
       this.major = this.user.major;
       this.phone = this.user.phone;
       this.year = this.user.year;
       this.sections = this.user.sections;
       console.log(this.sections);
     }
   })
 }

 //returns a promise containing the user's info
 checkUserInfo(){
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
           sections {
             courseName
           }
          }
         }
     `
   }).toPromise();
 }


}

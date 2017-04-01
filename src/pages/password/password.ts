import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

/*
  Generated class for the Password page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apollo: Angular2Apollo) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  // changePassword() {
  //     let alert = this.alertCtrl.create({
  //     inputs: [
  //       {
  //         name: 'currentPassword',
  //         placeholder: 'Current Password',
  //         type: 'password'
  //       },
  //       {
  //         name: 'newPassword',
  //         placeholder: 'New Password',
  //         type: 'password'
  //       },
  //       {
  //         name: 'newPassword',
  //         placeholder: 'Confirm Password',
  //         type: 'password'
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Confirm',
  //         handler: data => {
  //           console.log('Confirm clicked');
  //         }
  //       }
  //     ]
  //     });
  //     alert.present();
  // }

  saveChanges() {

  }

  cancel() {
    this.navCtrl.pop();
  }

}

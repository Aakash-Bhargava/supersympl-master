import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { PasswordPage } from '../password/password';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  currentUser = <any>{};

  loading: any;
  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private apollo: Angular2Apollo ) {
  }
  ngOnInit() {
    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      // console.log(this.currentUser);
    });
  }


  currentUserInfo(){
      return this.apollo.query({
        query: gql`
          query{
            user{
              id
              email
            }
          }
        `
      }).toPromise();
    }



  ngOnChanges() {
    console.log('Ng All Changes');
  }

  saveChages() {

  }
  changePassword(){
    this.navCtrl.push(PasswordPage);
  }

  logoutUser() {
      window.localStorage.removeItem('graphcoolToken');
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Logging Out...'
      });
      this.loading.present();
      location.reload();
      // this.app.getRootNav().setRoot(WelcomePage);
    }

}

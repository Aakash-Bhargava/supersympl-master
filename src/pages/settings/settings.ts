import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController, ViewController, ToastController, Keyboard } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { PasswordPage } from '../password/password';
import { WelcomePage } from '../welcome/welcome';

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
  major: any;
  year: any;

  data: any;

  loading: any;
  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private apollo: Angular2Apollo,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              public keyboard: Keyboard )
  {
    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.major = this.currentUser.major;
      this.year = this.currentUser.year;
    });
  }

  userQuery = gql`
    query{
      user{
        id
        email
        major
        year
      }
    }
  `;

  ionViewDidEnter() {
    this.data = this.apollo.watchQuery({query: this.userQuery});
    this.data.refetch().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      this.major = this.currentUser.major;
      this.year = this.currentUser.year;
    });
  }

  currentUserInfo(){
      return this.apollo.query({
        query: this.userQuery
      }).toPromise();
    }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.apollo.mutate({
      mutation: gql`
      mutation updateUser($id: ID!, $major: String, $year: String) {
        updateUser(id:$id, major:$major, year: $year) {
          id
        }
      }
      `, variables: {
        id: this.currentUser.id,
        major: this.major,
        year: this.year
      }
    }).toPromise();
    let toast = this.toastCtrl.create({
      message: 'Changes saved!',
      position: 'top',
      duration: 3000
    });
    toast.present();

    this.viewCtrl.dismiss();
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
      this.navCtrl.push(WelcomePage);
      //  this.app.getRootNav().setRoot(WelcomePage);
  }

  closeKeyboard() {
    this.keyboard.close();
  }

}

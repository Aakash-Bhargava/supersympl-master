import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Settings } from '../../providers/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';

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
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'Settings';
  pageTitle: string;

  subSettings: any = SettingsPage;

  loading: any;
  constructor(public navCtrl: NavController,
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch(this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  newUserNamePrompt() {
  let alert = this.alertCtrl.create({
    title: 'New Username',
    inputs: [
      {
        name: 'currentUsername',
        placeholder: 'Current Username'
      },
      {
        name: 'currentPassword',
        placeholder: 'Current Password'
      },
      {
        name: 'newUsername',
        placeholder: 'New Username'
      }
    ],
    buttons: [
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

  newPasswordPrompt() {
      let alert = this.alertCtrl.create({
      title: 'New Passwrod',
      inputs: [
        {
          name: 'currentPassword',
          placeholder: 'Current Password'
        },
        {
          name: 'newPassword',
          placeholder: 'New Password',
          type: 'password'
        }
      ],
      buttons: [
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

  newEmailPrompt() {
      let alert = this.alertCtrl.create({
      title: 'add Email',
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'New Email'
        },
        {
          name: 'newEmailPass',
          placeholder: 'New Email Password',
          type: 'password'
        }
      ],
      buttons: [
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

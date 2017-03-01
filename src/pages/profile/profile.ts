import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Settings } from '../../providers/settings';
import { SettingsPage } from '../settings/settings';
import { TranslateService } from 'ng2-translate/ng2-translate';

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
              public settings: Settings,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public translate: TranslateService,
              private alertCtrl: AlertController) {}

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
}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Angular2Apollo } from 'angular2-apollo';


import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab3Root } from '../pages';
import { Tab4Root } from '../pages';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab1Title = "Classes";
  tab2Title = "Map";
  tab3Title = "Calendar";
  tab4Title = "Profile";

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              private apollo: Angular2Apollo) {}
}

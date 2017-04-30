import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html'
})
export class SetLocationPage {
  classes = {};
  constructor(public navCtrl: NavController, public viewCtrl: ViewController) {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  next() {
    this.navCtrl.push(MapPage);
  }

  setPin() {
    let c = this.classes;
    //this.navCtrl.push(MapPage, {class: c});
    this.viewCtrl.dismiss(c);
  }
}

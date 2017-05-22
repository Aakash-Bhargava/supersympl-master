import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ION_CALENDAR_DIRECTIVES, IonCalendar } from '@ionic2-extra/calendar';

/*
  Generated class for the Schedule page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

  public event = {
    month: '2017-02-19',
    timeStarts: '09:00',
    timeEnds: '10:00'
  }

   public event2 = {
    month: '2017-02-22',
    timeStarts: '12:00',
    timeEnds: '13:00'
  }

   public event3 = {
    month: '2017-02-20',
    timeStarts: '12:00',
    timeEnds: '13:00'
  }
  onPeriodChange(event){
    console.log(event);
    let alert = this.alertCtrl.create({
      title: 'CSE 232 Homework',
      subTitle: 'Due 11:59pm',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  moreInfo() {
  let alert = this.alertCtrl.create({
    title: 'What is this page?',
    subTitle: 'This page contains due dates, study group appointments and a collective schedule for all the courses.',
    buttons: ['Dismiss']
  });
  alert.present()
}

}

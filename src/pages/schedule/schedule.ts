import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ION_CALENDAR_DIRECTIVES, IonCalendar } from '@ionic2-extra/calendar';

import {CalendarController} from "ion2-calendar/dist";

import { ModalController } from 'ionic-angular';
import { addEventModal } from '../addEventModal/addEventModal';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

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

  calView : string = "list";
  allEventsData = <any>{};
  allEvents = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public modalCtrl: ModalController,
              private calendar: IonCalendar,   private apollo: Angular2Apollo,
              public calendarCtrl: CalendarController) {}


  openCalendar(){
    this.calendarCtrl.openCalendar({
      from:new Date()
    },
    {
      enableBackdropDismiss: false
    })
    .then( res => { console.log(res) } );
  }

  basic() {
    this.calendarCtrl.openCalendar({
      isRadio: true,
      title:'Calendar',
      closeLabel: 'Done',
      weekdaysTitle: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
    })
      .then( (res:any) => { console.log(res) })
      .catch( () => {} )
  }

  ionViewDidLoad() {
    this.setEvents();
  }

  onPeriodChange(event){
    console.log(event);
    if (event.period.endDate == "Tue May 23 2017 00:00:00 GMT-0400 (EDT)") {
      let alert = this.alertCtrl.create({
        title: 'CSE 232 Homework',
        subTitle: 'Due 11:59pm',
        buttons: ['Dismiss']
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'CSE 415 Homework',
        subTitle: 'Due 11:59pm',
        buttons: ['Dismiss']
      });
      alert.present();
    }

  }

  moreInfo() {
  let alert = this.alertCtrl.create({
    title: 'What is this page?',
    subTitle: 'This page contains due dates, study group appointments and a collective schedule for all the courses.',
    buttons: ['Dismiss']
  });
  alert.present()
}

  addEvent(){
    console.log("clicked");
    let modal = this.modalCtrl.create(addEventModal);
    modal.present();
  }

  getEvents(){
    return this.apollo.query({
      query: gql`
      query{
        allEvents{
          title,
          class,
          dueDate,
          url,
          description
        }
      }
    `
    }).toPromise();
  }

  setEvents(){
    this.getEvents().then(({data}) => {
      if(data){
        this.allEventsData = data;
        this.allEvents = this.allEventsData.allEvents;
        for(let event of this.allEvents){
          var date = new Date(event.dueDate); // had to remove the colon (:) after the T in order to make it work
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();
          var minutes = date.getMinutes();
          var hours = date.getHours();
          var seconds = date.getSeconds();
          var myFormattedDate = day+"-"+monthIndex+"-"+year+" "+ hours+":"+minutes+":"+seconds;
          // event.dueDuate = myFormattedDate;
          // document.getElementById("dateExample").innerHTML = myFormattedDate
          // <p id="dateExample"></p>
          // console.log(myFormattedDate);
        }
      }
    })
  }

}

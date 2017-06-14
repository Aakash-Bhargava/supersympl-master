import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ION_CALENDAR_DIRECTIVES } from '@ionic2-extra/calendar';
import {CalendarController} from "ion2-calendar/dist";
import { ModalController } from 'ionic-angular';
import { addEventModal } from '../addEventModal/addEventModal';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { SelectedDay } from '../selectedDay/selectedDay';

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
  //day config
  calEvent = <any>{
    title: '',
    date: '',
    subTitle: '',
    marked: ''
  };
  allCalEv = <any>[];
  //the day chosen on the calendar
  dateSelected: any;
  //the date selected's events scheduled
  dateSelectedEvents: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public modalCtrl: ModalController,
              private apollo: Angular2Apollo,
              public calendarCtrl: CalendarController) {

              }

  ionViewDidLoad() {
    this.setEvents();
  }

  openCalendar(){
    this.calendarCtrl.openCalendar({
      from:new Date()
    },
    {
      showBackdrop: false,
      enableBackdropDismiss: false
    })
    .then( res => {} );
  }

  basic() {

    this.calendarCtrl.openCalendar({
      isRadio: true,
      title:'Calendar',
      closeLabel: 'x',
      weekdaysTitle: ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'],
      cssClass: 'calendarCSS',
      daysConfig: this.allCalEv
    })
    .then( (res:any) => {

      //convert res.time in ms to readable human date
      var datePicked = res;
      datePicked = datePicked.date;
      var utcSeconds = datePicked.time;
      this.dateSelected = new Date(utcSeconds); // The 0 there is the key, which sets the date to the epoch
      console.log(this.dateSelected);

      //after setting this.dateSelected --> query by date and retrieve assignments

      this.getSelectedDayEvent().then(({data}) => {
        if(data){
          this.dateSelectedEvents = data;
          this.dateSelectedEvents = this.dateSelectedEvents.allEvents;
          console.log(this.dateSelectedEvents);
          this.presentSelectedDayModal();
        }
      })

    })
    .catch( () => { console.log("Cancel clicked")} )
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
          var ev = this.calEvent = {
            subTitle: event.class,
            date: date,
            marked: true
          };
          this.allCalEv.push(ev);
        }
        console.log(this.allCalEv);
      }
    })
  }

  getSelectedDayEvent(){
    return this.apollo.query({
      query: gql`
      query getSelectedDayEvent($dueDate: DateTime) {
        allEvents(filter: {
          dueDate: $dueDate
        }) {
          id
          title
          class
          dueDate
          description
        }
      }
    `, variables: {
        dueDate: this.dateSelected
      }
    }).toPromise();
  }


  loadEvent(course: any, due: any){
    console.log("INSIDE LOAD EVENT");
    for(let event of this.allEvents)
    {
      if((event.class == course) && (event.dueDate == due))
      {
        console.log(event);
      }
    }
  }


  presentSelectedDayModal(){
    let selectedDayModal = this.modalCtrl.create(SelectedDay, { allEvents: this.dateSelectedEvents, date: this.dateSelected });
    selectedDayModal.present();
  }
}

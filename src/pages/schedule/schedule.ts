import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, IonicPage } from 'ionic-angular';
import { ION_CALENDAR_DIRECTIVES } from '@ionic2-extra/calendar';
import {CalendarController} from "ion2-calendar/dist";
import { ModalController } from 'ionic-angular';
import { addEventModal } from '../addEventModal/addEventModal';
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'

// import { ScheduleOptionsPage } from 'schedule-options/schedule-options';

import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { SelectedDay } from '../selectedDay/selectedDay';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {

  calView : string = "list";
  allEventsData = <any>{};
  allEvents = <any>[];
  now: any;
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

  currentUser: any;

  filterBy: any = "dueDate";

  first: boolean = true;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public modalCtrl: ModalController,
              private apollo: Angular2Apollo,public popoverCtrl: PopoverController,
              public calendarCtrl: CalendarController) {
                this.now = new Date().toISOString()

              }

  ionViewDidLoad() {
    this.setEvents();
    this.apollo.query({
      query: gql`
        query {
          user {
            id
            teaching {
              id
            }
          }
        }
      `
    }).toPromise().then(({data})=> {
      this.currentUser = data;
      console.log(this.currentUser);
      this.currentUser = this.currentUser.user;
    });
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
      closeLabel: '',
      weekdaysTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      cssClass: 'calendarCSS',
      daysConfig: this.allCalEv,
      monthTitle: 'MMMM yyyy',
      to: new Date().setMonth(new Date().getMonth() + 5)
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

  addEvent() {
    console.log("clicked");
    let modal = this.modalCtrl.create(addEventModal);
    modal.onDidDismiss(data => {
      this.refreshPage();
    })
    modal.present();
  }

  refreshPage(sortBy?) {
    let info;
    info = this.watch();
    info.refetch().then(({data}) => {
      if(data){
        let voted = false;
        this.allEvents = [];
        this.allEventsData = data;
        this.allEventsData = this.allEventsData.user;

        for (let section of this.allEventsData.sections) {
          for (let event of section.events) {
            voted = false;
            if (event.dueDate >= this.now) {
              // for (let downvote of event.downvotes) {
              //   if (downvote.id == this.currentUser.id) {
              //     voted = true;
              //     break;
              //   }
              // }
              this.allEvents.push({event: event, voted: voted, first: true});
            }
          }
        }

        this.allEvents.sort(this.sortDueDate);

        let last = new Date();

        for(let event of this.allEvents){
          if (event.event.dueDate == last) {
            event.first = false;
          }
          last = event.event.dueDate;

          var date = new Date(event.event.dueDate); // had to remove the colon (:) after the T in order to make it work
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();
          var minutes = date.getMinutes();
          var hours = date.getHours();
          var seconds = date.getSeconds();
          var myFormattedDate = day+"-"+monthIndex+"-"+year+" "+ hours+":"+minutes+":"+seconds;
          var ev = this.calEvent = {
            subTitle: '·',
            date: date,
            marked: true
          };
          this.allCalEv.push(ev);
        }
        console.log(this.allCalEv);
      }
    })
  }

  getEvents(){
    return this.apollo.query({
      query: gql`
      query{
        user{
          id
          email
          firstName
          lastName
          phone
          email
          major
          year
          profilePic
          sections{
            id
            sectionNumber
            courseName
            type
            events {
              id
              title
              section{
                id
                courseName
              }
              downvotes {
                id
              }
              dueDate
              dueTime
              url
              description
            }
          }
        }
      }
    `
    }).toPromise();
  }

  watch(){
    return this.apollo.watchQuery({
      query: gql`
      query{
        user{
          id
          email
          firstName
          lastName
          phone
          email
          major
          year
          profilePic
          sections{
            id
            sectionNumber
            courseName
            type
            events {
              id
              title
              section{
                id
                courseName
              }
              downvotes {
                id
              }
              dueDate
              dueTime
              url
              description
            }
          }
        }
      }
    `
    });
  }

  setEvents(){
    this.getEvents().then(({data}) => {
      if(data){
        let voted = false;
        this.allEvents = [];
        this.allEventsData = data;
        this.allEventsData = this.allEventsData.user;


        for (let section of this.allEventsData.sections) {
          for (let event of section.events) {
            voted = false;
            if (event.dueDate >= this.now) {
              // for (let downvote of event.downvotes) {
              //   if (downvote.id == this.currentUser.id) {
              //     voted = true;
              //     break;
              //   }
              // }
              this.allEvents.push({event: event, voted: voted, first: true});
            }
          }
        }

        this.allEvents.sort(this.sortDueDate);
        console.log(this.allEvents);

        let last = new Date();

        for(let event of this.allEvents) {
          if (event.event.dueDate == last) {
            event.first = false;
          }
          console.log(event);
          last = event.event.dueDate;

          var date = new Date(event.event.dueDate); // had to remove the colon (:) after the T in order to make it work
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();
          var minutes = date.getMinutes();
          var hours = date.getHours();
          var seconds = date.getSeconds();
          var myFormattedDate = day+"-"+monthIndex+"-"+year+" "+ hours+":"+minutes+":"+seconds;
          var ev = this.calEvent = {
            subTitle: '·',
            date: date,
            marked: true
          };
          this.allCalEv.push(ev);
        }
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
          section{
            id
            courseName
          }
          dueDate
          dueTime
          description
          url
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

  sortDueDate(a,b) {
    if (a.event.dueDate < b.event.dueDate)
      return -1;
    if (a.event.dueDate > b.event.dueDate)
      return 1;
    return 0;
  }
  sortDueDateData(a,b) {
    if (a.dueDate < b.dueDate)
      return -1;
    if (a.dueDate > b.dueDate)
      return 1;
    return 0;
  }

  downvote(event) {
    this.apollo.mutate({
      mutation: gql`
      mutation addToDownvoteOnEvent($downvotesUserId: ID!, $eventsEventId: ID!) {
        addToDownvoteOnEvent(downvotesUserId: $downvotesUserId, eventsEventId: $eventsEventId){
          eventsEvent{
            id
          }
        }
      }
      `,
      variables: {
        downvotesUserId: this.currentUser.id,
        eventsEventId: event.id
      }

    }).toPromise().then(({data})=> {
      this.refreshPage();
    });

  }

  gotoEvent(event) {
    let events = [];
    events.push(event.event);
    let selectedDayModal = this.modalCtrl.create(SelectedDay, { allEvents: events});
    selectedDayModal.present();

  }

  editEvent(event) {
    // let popover = this.popoverCtrl.create('ScheduleOptionsPage');
    // popover.present({ev: ev});
    console.log(event);
    let selectedDayModal = this.modalCtrl.create('ScheduleOptionsPage', { event: event});
    selectedDayModal.present();
    selectedDayModal.onDidDismiss(data => {
      this.refreshPage();
    })

  }
}

import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-selectedDay',
  templateUrl: 'selectedDay.html'
})
export class SelectedDay {

  events: any;
  eventsData = <any>[];
  dateSelected: any;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  now = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

   constructor(params: NavParams, public viewCtrl: ViewController) {

     this.events = params.get('allEvents');
     console.log(this.events);
     for (let event of this.events) {
       let dueTime;
       dueTime = new Date(event.dueTime);
       dueTime.setHours(dueTime.getHours() + 4);
       let t = {event: event, dueTime: dueTime};
       this.eventsData.push(t);
     }


     if (params.get('date')) {
       this.dateSelected = params.get('date');
     } else {
       this.dateSelected = this.events[0].dueDate;
     }

   }

   dismiss(){
     this.viewCtrl.dismiss();
   }
 }

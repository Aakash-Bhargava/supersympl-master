import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-selectedDay',
  templateUrl: 'selectedDay.html'
})
export class SelectedDay {

  events: any;
  dateSelected: any;

   constructor(params: NavParams, public viewCtrl: ViewController) {

     this.events = params.get('allEvents');
     console.log(this.events);

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

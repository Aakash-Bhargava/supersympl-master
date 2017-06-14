import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-selectedDay',
  templateUrl: 'selectedDay.html'
})
export class SelectedDay {

  events: any;
  date: any;

   constructor(params: NavParams, public viewCtrl: ViewController) {

     this.events = params.get('allEvents');
     this.date = params.get('date');
     console.log('all Events', params.get('allEvents'));
     console.log('date', params.get('date'));
   }

   dismiss(){
     this.viewCtrl.dismiss();
   }
 }

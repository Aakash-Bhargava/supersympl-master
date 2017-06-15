import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'page-selectedDay',
  templateUrl: 'selectedDay.html'
})
export class SelectedDay {

  events: any;
  date: any;
  dateString: any;

   constructor(params: NavParams, public viewCtrl: ViewController) {

     this.events = params.get('allEvents');

     this.date = params.get('date');
     var date = this.date.getDate();
     var month = this.date.getMonth(); //Be careful! January is 0 not 1
     var year = this.date.getFullYear();

     this.dateString = date + "/" +(month + 1) + "/" + year;
     console.log('all Events', params.get('allEvents'));
     console.log('date', this.dateString);
   }

   dismiss(){
     this.viewCtrl.dismiss();
   }
 }

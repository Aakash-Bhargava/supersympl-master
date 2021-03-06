import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];

  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
    "professor": "Example Person",
    "email": "example@gmail.com"
  };


  constructor(public http: Http) {
    let items = [
      {
         "name": "CSE 232",
         "profilePic": "assets/img/CSE_classes.jpg",
         "about": "Introduction to C++",
         "professor": "William Punch",
         "email": "example@gmail.com",
         "type": "CSE",
         "icon": "fa fa-laptop"
       },
       {
         "name": "CSE 231",
         "profilePic": "assets/img/CSE_classes.jpg",
         "about": "Introduction to Python",
         "professor": "Richard Enbody",
         "email": "example@gmail.com",
         "type": "CSE",
         "icon": "fa fa-laptop"
       },
       {
         "name": "ECE 201",
         "profilePic": "assets/img/ECE_classes.jpg",
         "about": "Circuits and Systems 1",
         "professor": "Kalyanmoy Deb",
         "email": "example@gmail.com",
         "type": "ECE",
         "icon": "fa fa-microchip"
       },
       {
         "name": "ECE 202",
         "profilePic": "assets/img/ECE_classes.jpg",
         "about": "Circuits and Systems 2",
         "Professor": "Kalyanmoy Deb",
         "email": "example@gmail.com",
         "type": "ECE",
         "icon": "fa fa-microchip"
       },
       {
         "name": "MTH 234",
         "profilePic": "assets/img/MTH_classes.jpg",
         "about": "Calculus 3",
         "professor":"Casim Abbas",
         "email": "example@gmail.com",
         "type": "MTH",
         "icon": "fa fa-calculator"
       },
       {
         "name": "MTH 235",
         "profilePic": "assets/img/MTH_classes.jpg",
         "about": "Differential Equations",
         "professor":"Gabriel Nagy",
         "email": "example@gmail.com",
         "type": "MTH",
         "icon": "fa fa-calculator"
       },
       {
         "name": "PHY 183",
         "profilePic": "assets/img/PHY_classes.png",
         "about": "Physics for Scientists and Engineers 1",
         "professor":"Hironori Iwasaki",
         "email": "example@gmail.com",
         "type": "PHY",
         "icon": "fa fa-thermometer-half"
       }
     ];

     for(let item of items) {
       this.items.push(new Item(item));
     }
  }

  query(params?: any) {
    if(!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for(let key in params) {
        let field = item[key];
        if(typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if(field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}

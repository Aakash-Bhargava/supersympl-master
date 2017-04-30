import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';


import * as Leaflet from 'leaflet';

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage implements OnInit{
  map: any;
  filterBy:string = "all";
  //class: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    //this.class = this.navParams.get('class');
    //console.log(this.class);
  }

  ngOnInit(): void {
    this.drawMap();
  }
  drawMap(): void {
    let map = Leaflet.map('map');
    this.map = map;
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA', {
      //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(map);

    //web location
    map.locate({ setView: true});

    //when we have a location draw a marker and accuracy circle
    /*function onLocationFound(e) {
      var radius = e.accuracy / 2;

      Leaflet.marker(e.latlng).addTo(map)
          .bindPopup("You are within " + radius + " meters from this point").openPopup();

      Leaflet.circle(e.latlng, radius).addTo(map);
    }
    map.on('locationfound', onLocationFound);
    //alert on location error
    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);*/
  }

  setLocation() {
    let addModal = this.modalCtrl.create(SetLocationPage);
    addModal.onDidDismiss(data => {
      console.log(data);
      this.addClassMarker(data);
    })
    addModal.present();
  }

  addClassMarker(c) {
    var that = this;
    //web location
    if(c) {
      this.map.locate({ setView: true});
    }


    //when we have a location draw a marker and accuracy circle
    function onLocationFound(e) {
      var radius = e.accuracy / 4;
      var profileIcon = Leaflet.icon({
        iconUrl: 'https://cdn0.iconfinder.com/data/icons/education-15/500/reader-512.png',
      //iconUrl: 'https://cdn0.iconfinder.com/data/icons/industrial-icons/164/5-512.png',
        iconSize: [38, 38], // size of the icon
      });

      let desc = '<h5>' + c.toUpperCase() + '</h5>';
      desc += '<p><em>(4) People studying:</em></p>';
      desc += '<p><img src="http://i1246.photobucket.com/albums/gg611/theofficechic/Design/profile-round.png" style="width:20%;height:20%;">\
      <img src="http://ablissfulhaven.com/dev/wp-content/uploads/2015/06/round-chokolatta-profile-pic.png" style="width:20%;height:20%;">\
      <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/6083/profile/profile-512_1.jpg" style="width:20%;height:20%;">\
      <img src="https://rigorous-digital.co.uk/wp-content/uploads/2014/06/profile-round.png" style="width:20%;height:20%;"></p>';
      desc += '<p class="buttons"><button ion-button style="color:white;background-color:red;">Ask to Join</button></p>';
      Leaflet.marker(e.latlng, {icon: profileIcon}).addTo(that.map)
          .bindPopup(desc);//.openPopup();

      Leaflet.circle(e.latlng, radius, {color: 'red'}).addTo(that.map);
    }
    this.map.on('locationfound', onLocationFound);
  }

  filter() {
  }

}

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
    }).addTo(this.map);

    //web location
    this.map.locate({ setView: true});
    this.map.on('locationfound', addMockPins);

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function addMockPins(e) {
      var radius = e.accuracy / 4;
      var profileIcon = Leaflet.icon({
        iconUrl: 'https://cdn0.iconfinder.com/data/icons/education-15/500/reader-512.png',
        iconSize: [38, 38] // size of the icon
      });

      let pins = [
        {
          class: 'CHEM 141',
          time: '2pm - 5pm',
          offset: [0.0001, 0.0007],
          images: ['<img src="http://i1246.photobucket.com/albums/gg611/theofficechic/Design/profile-round.png" style="width:20%;height:20%;">']

        },
        {
          class: 'MTH 234',
          time: '10am - 12pm',
          offset: [0.0008, 0.0003],
          images: [
            '<img src="http://ablissfulhaven.com/dev/wp-content/uploads/2015/06/round-chokolatta-profile-pic.png" style="width:20%;height:20%;">',
            '<img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/6083/profile/profile-512_1.jpg" style="width:20%;height:20%;">'
          ]
        },
        {
          class: 'FI 320',
          time: '8pm - 2am',
          offset: [0.0004, -0.0005],
          images: [
            '<img src="https://rigorous-digital.co.uk/wp-content/uploads/2014/06/profile-round.png" style="width:20%;height:20%;">',
            '<img src="https://learn.neighborly.com/wp-content/uploads/2015/03/sean_profile_picture_round.png" style="width:20%;height:20%;">',
            '<img src="http://www.imperfectlyhis.com/wp-content/uploads/2016/01/round-profile.png" style="width:20%;height:20%;">'
          ]
        },
        {
          class: 'IAH 201',
          time: '5pm - 8pm',
          offset: [-0.0006, -0.0001],
          images: [
            '<img src="http://www.ruchikabehal.com/wp-content/uploads/2013/12/Profile-round-shot.jpg" style="width:20%;height:20%;">',
            '<img src="http://helpgrowchange.com/wp-content/uploads/2014/03/tb_profile_201303_round.png" style="width:20%;height:20%;">',
            '<img src="http://2.bp.blogspot.com/-mQqw7TAQvW4/VX4vn65C9TI/AAAAAAAABDQ/lrrNssmxc-g/s290/round%2Bprofile1.png" style="width:20%;height:20%;">'
          ]
        },
      ];
      for(var i=0; i<4; i++) {
        let num = pins[i]['images'].length;
        let desc = '<h5 style="text-align:center;">' + pins[i]['class'] + '</h5>';
        desc += '<p>' + pins[i]['time'] + '</p>';
        desc += '<p><em>(' + num +') People studying:</em></p>';
        desc += '<p>';
        for(var j=0; j<num; j++) {
          desc += pins[i]['images'][j];
        }
        desc += '</p>';
        desc += '<p class="buttons"><button ion-button style="color:white;background-color:red;">Ask to Join</button></p>';

        let new_lat = e.latlng.lat + pins[i]['offset'][0];
        let new_lng = e.latlng.lng + pins[i]['offset'][1];
        let latlng = Leaflet.latLng(new_lat, new_lng);

        Leaflet.marker(latlng, {icon: profileIcon}).addTo(map)
            .bindPopup(desc);//.openPopup();
      }
    }
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
      this.map.on('locationfound', onLocationFound);
    }


    //when we have a location draw a marker and accuracy circle
    function onLocationFound(e) {
      var radius = e.accuracy / 4;
      var profileIcon = Leaflet.icon({
        iconUrl: 'https://cdn0.iconfinder.com/data/icons/education-15/500/reader-512.png',
      //iconUrl: 'https://cdn0.iconfinder.com/data/icons/industrial-icons/164/5-512.png',
        iconSize: [38, 38], // size of the icon
      });

      let desc = '<h5 style="text-align:center;">' + c.name.toUpperCase() + '</h5>';
      //let desc = '<h5>' + c.name.toUpperCase() + '</h5>';
      desc += '<p>'+ c.startTime+' - '+c.endTime+'</p>';
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
  }

  filter() {
  }

}

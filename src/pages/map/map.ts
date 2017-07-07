import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';

//Graphcool
import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


import * as Leaflet from 'leaflet';

// This global variable makes me sad
var mocks = false;


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage implements OnInit {
  map: any;
  locationInfo = <any>{};
  filterBy:string = "all";
  alllocations: any;

  currentUser = <any>{};
  //class: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public apollo: Angular2Apollo) {
    this.getAllPins().then(({data})=> {
      this.alllocations = data;
      this.alllocations = this.alllocations.allMapPinses;
    })
    this.currentUserInfo().then(({data}) => {
      if (data){
        this.currentUser = data;
        this.currentUser = this.currentUser.user;
        // console.log(this.currentUser);
      }
    })
  }

  ngOnInit(): void {
    this.drawMap();
  }
  drawMap(): void {
    var that = this;
    let map = Leaflet.map('map');
    this.map = map;

    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA', {
      //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',

      maxZoom: 18
    }).addTo(this.map);

    //web location
    this.map.locate({ setView: true});
    this.map.on('locationfound', function addMockPins(e) {
      let pins: any;
      that.getAllPins().then(({data})=> {
        this.alllocations = data;
        this.alllocations = this.alllocations.allMapPinses;

        var radius = e.accuracy / 4;
        var profileIcon = Leaflet.icon({
          iconUrl: 'http://www.clker.com/cliparts/k/Q/V/D/z/u/map-marker-small.svg',
          iconSize: [60, 50] // size of the icon
        });
        for (let location of this.alllocations) {
          console.log(this.alllocations);
          let desc = '<h5 style="text-align:center;">' + location.sectionName + '</h5>';
          let start = new Date(location.startTime);
          let end = new Date(location.endTime);
          desc += '<p class="centerb">' + start.toLocaleDateString() + '</p>';
          desc += '<p class="centerb">' + that.formatAMPM(start) + ' - ' + that.formatAMPM(end) +'</p>';
          // desc += '<button style="background-color: #cc2121;"> Join </button>';
          desc += '<p class="centerb">';
          for (let user of location.users) {
            desc += '<img class="centerb" src=' + user.profilePic + ' style="width:30%;height:30%;border-radius: 50%;">';
          }
          desc += '</p>';

          let latlng = Leaflet.latLng(location.latitude, location.longitude);
          Leaflet.marker(latlng, {icon: profileIcon}).addTo(map)
              .bindPopup(desc);//.openPopup();
        }
      })

    });
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
      this.map.on('locationfound', function (onLocationFound) {
        that.createPin(c,onLocationFound.latlng.lat,onLocationFound.latlng.lng );
        var profileIcon = Leaflet.icon({
          iconUrl: 'http://www.clker.com/cliparts/k/Q/V/D/z/u/map-marker-small.svg',
        //iconUrl: 'https://cdn0.iconfinder.com/data/icons/industrial-icons/164/5-512.png',
          iconSize: [60, 50], // size of the icon
        });

        let start = new Date(c['startTime']);
        let end = new Date(c['endTime']);


        let desc = '<h5 style="text-align:center;">' + c['name'] + '</h5>';
        desc += '<p class="centerb">' + that.formatAMPM(start) + ' - ' + that.formatAMPM(end) +'</p>';
        desc += '<button style="text-align:center;"> Join </button>';
        let latlng = Leaflet.latLng(onLocationFound.latlng.lat, onLocationFound.latlng.lng);
        Leaflet.marker(latlng, {icon: profileIcon}).addTo(that.map)
            .bindPopup(desc);//.openPopup();
      });
    }
  }

  createPin(c, lat, lng) {
    this.apollo.mutate({
      mutation: gql`
      mutation createMapPins($latitude: Float, $longitude: Float, $startTime: DateTime, $endTime: DateTime, $sectionName: String, $usersIds: [ID!] ){
        createMapPins(latitude: $latitude, longitude: $longitude, startTime: $startTime, endTime: $endTime, sectionName: $sectionName, usersIds: $usersIds  ){
          id
        }
      }
      `,
      variables: {
        latitude: lat,
        longitude: lng,
        startTime: c.startTime,
        endTime: c.endTime,
        sectionName: c.name,
        usersIds: [this.currentUser.id]
      }
    });
  }

  getAllPins() {
    return this.apollo.query({
      query: gql`
        query{
          allMapPinses{
            id
            startTime
            endTime
            latitude
            longitude
            sectionName
            users {
              id
              profilePic
            }
          }
        }
      `
    }).toPromise();
  }

  currentUserInfo(){
      return this.apollo.query({
        query: gql`
          query{
            user{
              id
            }
          }
        `
      }).toPromise();
    }

    //when we have a location draw a marker and accuracy circle
    onLocationFound(e) {
      // var radius = e.accuracy / 4;
      // var profileIcon = Leaflet.icon({
      //   iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678093-pin-128.png',
      // //iconUrl: 'https://cdn0.iconfinder.com/data/icons/industrial-icons/164/5-512.png',
      //   iconSize: [38, 38], // size of the icon
      // });

      // var that = this;
      // let desc = '<h5 style="text-align:center;">' + this.alllocations['sectionName'] + '</h5>';
      // desc += '<p class="centerb">' + this.alllocations['startTime'] + ' - ' + this.alllocations['endTime'] +'</p>';
      // let latlng = Leaflet.latLng(this.alllocations['latitude'], this.alllocations['longitude']);
      // Leaflet.marker(latlng, {icon: profileIcon}).addTo(that.map)
      //     .bindPopup(desc);//.openPopup();
      // let desc = '<h5 style="text-align:center;">' + c.name.toUpperCase() + '</h5>';
      // //let desc = '<h5>' + c.name.toUpperCase() + '</h5>';
      // desc += '<p>'+ c.startTime+' - '+c.endTime+'</p>';
      // desc += '<p><em>(4) People studying:</em></p>';
      // desc += '<p><img src="http://i1246.photobucket.com/albums/gg611/theofficechic/Design/profile-round.png" style="width:20%;height:20%;">\
      // <img src="http://ablissfulhaven.com/dev/wp-content/uploads/2015/06/round-chokolatta-profile-pic.png" style="width:20%;height:20%;">\
      // <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/6083/profile/profile-512_1.jpg" style="width:20%;height:20%;">\
      // <img src="https://rigorous-digital.co.uk/wp-content/uploads/2014/06/profile-round.png" style="width:20%;height:20%;"></p>';
      // desc += '<p class="buttons"><button ion-button style="color:white;background-color:red;">Ask to Join</button></p>';
      // Leaflet.marker(e.latlng, {icon: profileIcon}).addTo(that.map)
      //     .bindPopup(desc);//.openPopup();
      //
      // Leaflet.circle(e.latlng, radius, {color: 'red'}).addTo(that.map);
    }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  }

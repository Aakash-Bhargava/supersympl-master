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
        console.log(this.currentUser);
      }
    })
  }

  ngOnInit() {
    this.drawMap();
  }
  drawMap(filterBy?) {
    var that = this;
    let map: any;
    if (!filterBy) {
      map = Leaflet.map('map');
      this.map = map;

      Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA', {
        minZoom: 7.5,
        zoom: 16,
        maxZoom: 18
      }).addTo(this.map);

      //web location
      this.map.locate({ setView: true});
    }



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

        let amgroup = false;
        that.currentUserInfo().then(({data}) => {
          if (data){
            this.currentUser = data;
            this.currentUser = this.currentUser.user;

            //User position
            // Leaflet.marker(e.latlng).addTo(map)
            var circle = Leaflet.circle(e.latlng, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: radius
            }).addTo(map);

            //Creating pin for every location
            for (let location of this.alllocations) {
              console.log(this.alllocations);
              let desc = '<div class="popheader"><h5">' + location.sectionName + '</h5></div>';
              let start = new Date(location.startTime);
              let end = new Date(location.endTime);
              desc += '<div class="popcontent"<p class="centerb">' + start.toUTCString().substr(0,17);
              desc += '</br>' + that.formatAMPM(start) + ' - ' + that.formatAMPM(end) +'</p>';
              desc += '<p>';
              for (let user of location.users) {
                if (user.id == this.currentUser.id) {
                  amgroup = true;
                }
                desc += '<img src=' + user.profilePic + ' style="width:30%;height:30%;border-radius: 50%;">';
              }

              desc += '</p>';

              if (!amgroup) {
                desc += '<button class="join" (tap)="joinClass()"> Join </button></div>';
              }

              let latlng = Leaflet.latLng(location.latitude, location.longitude);
              Leaflet.marker(latlng, {icon: profileIcon}).addTo(map)
                  // .bindPopup(desc)
                  .on('click', function onClick() {
                    let addModal = that.modalCtrl.create('StudygroupPage', {location: location});
                    addModal.present();
                  });
            }
          }
        })
      });
    })
  }

  joinClass() {
    console.log("join");
  }

  filter(filterBy) {
    this.drawMap(filterBy);
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
            createdAt
            users {
              id
              firstName
              lastName
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

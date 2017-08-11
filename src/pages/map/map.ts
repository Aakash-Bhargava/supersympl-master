import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { SetLocationPage } from '../set-location/set-location';

import { StudygroupPage } from '../studygroup/studygroup';

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

  mapMarkers= <any>[];
  loading: any;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  now = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0,-1);

  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, public navParams: NavParams, public modalCtrl: ModalController, public apollo: Angular2Apollo) {

    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
      console.log(this.currentUser);
      this.getAllPins().then(({data})=> {
        this.alllocations = data;
        this.alllocations = this.alllocations.allMapPinses;
        for (let location of this.alllocations) {
          if (location.endTime <= this.now) {
            console.log("expired");
            this.deletePin(location.id);
          } else if (location.users.length == 0) {
            console.log("No user");
            this.deletePin(location.id);
          }
        }
        this.getAllPins().then(({data})=> {
          this.alllocations = data;
          this.alllocations = this.alllocations.allMapPinses;
          console.log(this.alllocations);
        });
      });
    });
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

      Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXN1ZGV2c2hvcCIsImEiOiJjajMwYnR4bWMwMDA0Mndta2kzdTZrNjJrIn0.YMCUQHUrN6vm6_HK5bgwnA', {
        minZoom: 10,
        zoom: 16
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
          iconAnchor:   [25, 25],
          iconSize: [60, 50] // size of the icon
        });

        let amgroup = false;
        that.currentUserInfo().then(({data}) => {
          if (data){
            this.currentUser = data;
            this.currentUser = this.currentUser.user;

            //Creating pin for every location
            for (let location of this.alllocations) {

              let latlng = Leaflet.latLng(location.latitude, location.longitude);
              that.mapMarkers.push(Leaflet.marker(latlng, {icon: profileIcon}).addTo(map)
                  // .bindPopup(desc)
                  .on('click', function onClick() {
                    let addModal = that.modalCtrl.create(StudygroupPage, {location: location});
                    addModal.present();
                  }));
            }
          }
        })
      });
    })
  }

  clearMarkers() {
    for(var i = 0; i < this.mapMarkers.length; i++){
      this.map.removeLayer(this.mapMarkers[i]);
    }
  }

  filter(filterBy: String) {
    // this.drawMap(filterBy);
    console.log("filter function");
    let that = this;
    this.clearMarkers();
    var profileIcon = Leaflet.icon({
      iconUrl: 'http://www.clker.com/cliparts/k/Q/V/D/z/u/map-marker-small.svg',
      iconAnchor:   [25, 25],
      iconSize: [60, 50] // size of the icon
    });
    for (let location of this.alllocations) {
      console.log(filterBy);
      console.log(location.sectionName);
      let latlng = Leaflet.latLng(location.latitude, location.longitude);
      if (filterBy == location.sectionName || filterBy == "all") {
        this.mapMarkers.push(Leaflet.marker(latlng, {icon: profileIcon}).addTo(this.map)
            // .bindPopup(desc)
            .on('click', function onClick() {
              let addModal = that.modalCtrl.create(StudygroupPage, {location: location});
              addModal.present();
            }));
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
    if(c) {

      this.loading = this.loadingCtrl.create({
        content: 'Creating Pin...'
      });
      this.loading.present();

      this.map.locate({ setView: true});
      this.map.on('locationfound', function (onLocationFound) {
        that.createPin(c,onLocationFound.latlng.lat,onLocationFound.latlng.lng ).then(({data}) => {
          console.log(data);
          let newPin;
          newPin = data;
          newPin = newPin.createMapPins;
          var profileIcon = Leaflet.icon({
            iconUrl: 'http://www.clker.com/cliparts/k/Q/V/D/z/u/map-marker-small.svg',
            iconAnchor:   [25, 25],
            iconSize: [60, 50], // size of the icon
          });
            let latlng = Leaflet.latLng(onLocationFound.latlng.lat, onLocationFound.latlng.lng);
            that.mapMarkers.push(Leaflet.marker(latlng, {icon: profileIcon}).addTo(that.map)
                // .bindPopup(desc)
                .on('click', function onClick() {
                  let addModal = that.modalCtrl.create(StudygroupPage, {location: newPin});
                  addModal.present();
                }));
                that.loading.dismiss();
          // }
        });
      });
    }
  }

  createPin(c, lat, lng) {
    return this.apollo.mutate({
      mutation: gql`
      mutation createMapPins($latitude: Float, $longitude: Float,$location: String, $startTime: DateTime, $endTime: DateTime, $sectionName: String, $usersIds: [ID!] ){
        createMapPins(latitude: $latitude, longitude: $longitude,location: $location, startTime: $startTime, endTime: $endTime, sectionName: $sectionName, usersIds: $usersIds  ){
          id
          startTime
          endTime
          latitude
          longitude
          sectionName
          createdAt
          location
          users {
            id
            firstName
            lastName
            profilePic
          }
        }
      }
      `,
      variables: {
        latitude: lat,
        longitude: lng,
        location: c.location,
        startTime: c.startTime,
        endTime: c.endTime,
        sectionName: c.name,
        usersIds: [this.currentUser.id]
      }
    }).toPromise();
  }

  getAllPins() {
    return this.apollo.query({
      query: gql`
        query allMapPinses($userId: ID) {
          allMapPinses (filter: {users_every: {id: $userId}}) {
            id
            startTime
            endTime
            latitude
            longitude
            sectionName
            createdAt
            location
            users {
              id
              firstName
              lastName
              profilePic
            }
          }
        }
      `, variables: {
        userId: this.currentUser.id
      }
    }).toPromise();
  }

  currentUserInfo(){
      return this.apollo.query({
        query: gql`
          query{
            user{
              id
              sections {
                sectionNumber
                courseName
              }
            }
          }
        `
      }).toPromise();
    }

    deletePin(pinId) {
      this.apollo.mutate({
        mutation: gql`
        mutation deleteMapPins($id: ID!){
          deleteMapPins(id:$id){
             id
          }
        }
        `,variables:{
          id: pinId
        }
      }).toPromise().then(({data}) => {
        console.log("pin deleted");
      });

    }

  }

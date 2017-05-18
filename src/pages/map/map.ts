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
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA', {
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
          iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678093-pin-128.png',
          iconSize: [38, 38] // size of the icon
        });
        for(var i=0; i < this.alllocations.length; i++) {
          console.log(this.alllocations);
          let desc = '<h5 style="text-align:center;">' + this.alllocations[i]['sectionName'] + '</h5>';
          desc += '<p class="centerb">' + this.alllocations[i]['startTime'] + ' - ' + this.alllocations[i]['endTime'] +'</p>';
          let latlng = Leaflet.latLng(this.alllocations[i]['latitude'], this.alllocations[i]['longitude']);
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
          iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678093-pin-128.png',
        //iconUrl: 'https://cdn0.iconfinder.com/data/icons/industrial-icons/164/5-512.png',
          iconSize: [38, 38], // size of the icon
        });
        let desc = '<h5 style="text-align:center;">' + c['name'] + '</h5>';
        desc += '<p class="centerb">' + c['startTime'] + ' - ' + c['endTime'] +'</p>';
        let latlng = Leaflet.latLng(onLocationFound.latlng.lat, onLocationFound.latlng.lng);
        Leaflet.marker(latlng, {icon: profileIcon}).addTo(that.map)
            .bindPopup(desc);//.openPopup();
      });
    }
  }

  createPin(c, lat, lng) {
    this.apollo.mutate({
      mutation: gql`
      mutation createMapPins($latitude: Float, $longitude: Float, $startTime: String, $endTime: String, $sectionName: String, $userId: ID! ){
        createMapPins(latitude: $latitude, longitude: $longitude, startTime: $startTime, endTime: $endTime, sectionName: $sectionName, userId: $userId  ){
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
        userId: this.currentUser.id
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


  }

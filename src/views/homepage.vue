
<template>
<!--login successfully -->
<div>

  <div class="col-sm-5">
    <gmap-map ref="map" id="map" :center="center" :zoom="4" style="height: 300px">
      <template v-for="(user, index) in userInfo">
        <gmap-marker :key="user.date" v-if="user.status!=='KET-THUC'"  :position="user.location" :clickable="false" :draggable="false"  :label="'K'" :icon="'./src/assets/images/khach.png'"></gmap-marker>
      </template>
      <template v-for="(marker, i) in taixeInfoFunction">
        <gmap-marker :key="i"  :position="marker.location" :clickable="false" :draggable="false" :label="'T'" :icon="'./src/assets/images/taixe.png'" ></gmap-marker>
        <!--  @position_changed="direction(marker)-->
      </template>
    </gmap-map>
    <template>
      <div>
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Thông tin</th>
          </tr>
        </thead>
        <tbody >
          <tr>
            <th>Tên tài xế</th>
            <td>{{taixe.username}}</td>
          </tr>
          <tr>
            <th>Khách hàng</th>
            <td>{{user.phone}}</td>
          </tr>
          <tr>
            <th>Địa điểm đón</th>
            <td>{{user.address}}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </template>
  </div>
  <div class="col-sm-7">
    <center>Danh sách khách hàng</center>
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th>Time</th>
          <th>Số điện thoại</th>
          <th>Địa điểm đón</th>
          <th>Status</th>
          <th>Tên tài xế</th>
          <th>Lộ trình</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(marker, index) in listUser" v-if="marker.status!=='KET-THUC'" >
          <td>{{marker.date}}</td>
          <td>{{marker.phone}}</td>
          <td>{{marker.address}}</td>
          <td>{{marker.status}}</td>
          <td>{{marker.taixe}}</td>
          <td v-if="typeof marker.taixe!=='undefined'"><button class="btn btn-primary btn-sm" @click.prevent="direction(false, marker)">Xem</button></td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import Firebase from 'firebase'
//var bcrypt = require('bcrypt');
let saltRounds = 10;
let config = {
  apiKey: "AIzaSyBdayjA3EmnHntCcCA0caJvfUQPESPassM",
  authDomain: "app-ddv.firebaseapp.com",
  databaseURL: "https://app-ddv.firebaseio.com",
  projectId: "app-ddv",
  storageBucket: "app-ddv.appspot.com",
  messagingSenderId: "966606157223"
}
let app = Firebase.initializeApp(config);
let db = app.database();
let taixeInfoRef = db.ref('taixe-info');
let userInfoRef = db.ref('user-info');
var directionsService;
var directionsDisplay;
export default {
  firebase: {
    taixeInfo: taixeInfoRef,
    userInfo: userInfoRef
  },
  data() {
    return {
      center: {
        lat: 14.058324,
        lng: 108.277199
      },
      user:{},
      taixe:{},
      displayInfo: false,
      isXem:false
    }
  },


  methods: {
    clickMarker: function(event, obj) { // click vao 1 marker hien len info cua maker do
      this.displayInfo = true;
      this.obj = obj;
    },
    /*
    @param:
      obj: true => location has been updated
          false => location has not changed yet
    */
    direction: function(obj, user) {

      if(this.isXem===true) {
        directionsDisplay.setMap(null);
      }

      var source ;
      var des ;
      if(obj === false) {
        for(let i = 0; i < this.taixeInfo.length; i++) {  // find taixe for user
          if(this.taixeInfo[i].username === user.taixe) {
            source = new google.maps.LatLng(this.taixeInfo[i].location.lat, this.taixeInfo[i].location.lng);
            this.taixe = this.taixeInfo[i];
            des = new google.maps.LatLng(user.location.lat, user.location.lng);
            this.user = user;
            break;
          }
        }
      } else {
        source = new google.maps.LatLng(user.location.lat, user.location.lng);
        des = new google.maps.LatLng(this.user.location.lat, this.user.location.lng)
      }

      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: this.$refs['map'].$mapObject,
        suppressMarkers: true,
      });

      directionsService.route({
        origin: source,
        destination: des,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
      this.isXem=true;
    }
  },
  computed:{
    listUser: function() {
       return this.userInfo.reverse();
    },
    taixeInfoFunction: function (){
      if(this.isXem === true) {

        for(let i = 0; i < this.taixeInfo.length; i++) {
          if(this.taixeInfo[i].username===this.taixe.username && this.taixeInfo[i].location !== this.taixe.location) {
            this.taixe = this.taixeInfo[i];
            this.direction(true, this.taixeInfo[i]);
          }
        }
      }
      return this.taixeInfo;
    }

  }
}
</script>

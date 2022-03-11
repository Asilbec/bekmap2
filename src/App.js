import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import mapStyles from "./mapStyle/mapStyles";
import RoundOnelist from './randomCountry/sortedList';
import RoundTwolist from './randomCountry/sortedListTwo';
import RoundThreeList from './randomCountry/sortedListThree';
import './App.css'
import axios from 'axios'
import { motion, useAnimation } from "framer-motion"

const mapContainerStyle = {
  height: "100%",
  width: "100vw",
};
var NEW_ZEALAND_BOUNDS = {
  north: 85,
  south: -85,
  west: -180,
  east: 180
};


/*

*/




function App() {

  const variants = {
    visible:
    {
      background: 'rgb(92, 221, 53)', transition: {
        duration: 0.2,
      },
    },
    hidden:
    {
      background: 'rgb(226, 71, 71)',
      transition: { duration: 0.2 },
    },
  }

  const controls = useAnimation()


  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"
  })
  const [mapz, setMap] = React.useState(null)
  console.log(mapz)

  const [counter, newCounter] = useState(0)

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const OPTIONS = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    zoomControl: true,
    minZoom: 3,
    styles: mapStyles,
    restriction: {
      latLngBounds: NEW_ZEALAND_BOUNDS,
      strictBounds: false,
    },
  }
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;

  }, []);

  function onMapClick(e) {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU').then(function (response) {
      const country = response.data.results[(response.data.results).length - 1]
      const formatted = country.formatted_address
      console.log(formatted)
      if (formatted === currentCountry) {
        newCounter(counter + 1)
        generateNewList()
        controls.start('visible')


      }
      else {
        newCounter(counter - 1)
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + currentCountry + '&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU').then(function (res) {
          const correct = (res.data.results[0].geometry.location)
          const lat = correct.lat
          const lng = correct.lng

          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(4);
          controls.start('hidden')
        })
      }
    })
  }

  const [center, newCenter] = useState(
    { lat: -3.745, lng: -38.523 }
  )

  const [currentCountry, newCountry] = useState('')

  function generateNewList() {
    if (counter < 6) {
      newCountry(RoundOnelist[Math.floor(Math.random() * (RoundOnelist.length - 1))])
    }
    if (counter > 5 & counter < 14) {
      newCountry(RoundTwolist[Math.floor(Math.random() * (RoundTwolist.length - 1))])
    } if (counter > 14) {
      newCountry(RoundThreeList[Math.floor(Math.random() * (RoundThreeList.length - 1))])
    }
  }

  useEffect(() => {
    generateNewList()
    newCenter({ lat: -3.745, lng: -38.523 })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return isLoaded ? (
    <motion.div style={{ height: '100vh' }}>
      <motion.div initial="visible"
        animate={controls}
        variants={variants}
        onAnimationComplete={() => console.log('nice')}
        className='search'>
        <motion.p animate={{ fontSize: 19 }}>{currentCountry}</motion.p>
        <motion.p>{counter}</motion.p>
      </motion.div>


      <GoogleMap
        id='google-map-script'
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={OPTIONS}
        onClick={(e) => onMapClick(e)}
        onLoad={onMapLoad}
        onUnmount={onUnmount}
        zoom={2}
      >
      </GoogleMap>

    </motion.div>

  ) : <></>
}


export default App

import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import mapStyles from "./mapStyle/mapStyles";
import RoundOnelist from './randomCountry/sortedList';
import RoundTwolist from './randomCountry/sortedListTwo';
import RoundThreeList from './randomCountry/sortedListThree';
import './App.css'
import axios from 'axios'
import { motion, useAnimation } from "framer-motion"
import { Marker } from '@react-google-maps/api';
const mapContainerStyle = {
  height: "100%",
  width: "100vw",
  border: 'none'
};
var NEW_ZEALAND_BOUNDS = {
  north: 85,
  south: -85,
  west: -180,
  east: 180
};




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

  const MenuAnimationVari = {
    visible:
    {
      scale: 1, transition: {
        duration: 0.2,
      },

    },
    hidden:
    {
      scale: 0,
      transition: { duration: 0.5 },
    },
  }




  const controls = useAnimation()
  const showMenuAnimation = useAnimation()


  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"
  })
  const [mapz, setMap] = React.useState(null)
  console.log(mapz)

  const [counter, newCounter] = useState(0)
  const [disableZoom, newDisable] = useState(false)
  const [disableGesture, newGesture] = useState('none')
  const [gotwrong, newGame] = useState(false)
  const [prev, newPrev] = useState(0)

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const OPTIONS = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    minZoom: 3,
    styles: mapStyles,
    restriction: {
      latLngBounds: NEW_ZEALAND_BOUNDS,
      strictBounds: false,
    },
    gestureHandling: disableGesture
    ,
    zoomControl: disableZoom,
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
        if (gotwrong === true) {
          showMenuAnimation.start('visible')
        } else {
          newCounter(counter + 1)
          generateNewList()
          controls.start('visible')
          newShown(false)
        }
      }
      else {

        const stored = localStorage.getItem('highScore')
        console.log(stored)
        if (counter > stored || stored === null) {
          localStorage.setItem('highScore', counter)
          newPrev(counter)
        }
        newDisable(true)
        newGesture('none')
        newShown(true)
        newGame(true)
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + currentCountry + '&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU').then(function (res) {
          const correct = (res.data.results[0].geometry.location)
          const lat = correct.lat
          const lng = correct.lng
          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(4);
          controls.start('hidden')
          newCenter(
            { lat: lat, lng: lng }
          )
        })
      }
    })
  }

  const [center, newCenter] = useState(
    { lat: 27.115046560668105, lng: -45.60478891297624 }
  )

  const [markerShown, newShown] = useState(false)

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

  function beginGame() {

    newCounter(0)
    showMenuAnimation.start('hidden')
    newShown(false)
    newDisable(false)
    newGesture('Greedy')
    generateNewList()
    controls.start('visible')
    newGame(false)
    newCenter(
      { lat: 27.115046560668105, lng: -45.60478891297624 }
    )
    mapRef.current.setZoom(2);
  }

  useEffect(() => {
    generateNewList()
    newCenter(
      { lat: 27.115046560668105, lng: -45.60478891297624 }
    )
    if (localStorage.getItem('highScore') > 0) {
      newPrev(localStorage.getItem('highScore'))
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  return isLoaded ? (
    <motion.div className='App' style={{ height: '100vh' }}>
      <motion.div initial="visible"
        animate={controls}
        variants={variants}
        className='search'>
        <motion.p animate={{ fontSize: 19 }}>{currentCountry}</motion.p>
        <motion.p style={{ width: '60%', borderLeft: '2px solid white' }}>Score : {counter}</motion.p>
      </motion.div>

      <motion.div initial="visible"
        animate={showMenuAnimation}
        variants={MenuAnimationVari} className='MenuOverLay'>
        <motion.div

          className='menuOverlayContents'>
          <div className='menuText' style={{ textAlign: 'center' }}>
            <motion.h1 animate={{ fontSize: '50px' }}>Your Score Was : {counter}</motion.h1>
            <motion.h3 animate={{ fontSize: '25px' }}>Preview High :  {prev}</motion.h3>
          </div>
          <motion.button whileHover={{ backgroundColor: 'rgb(92, 221, 53)', y: '-5px', scale: 1.01 }} transition={{ duration: 0.3 }} onClick={() => beginGame()} id='start'>START</motion.button>
        </motion.div>
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
        <Marker
          position={center}
          visible={markerShown}
          animation={window.google.maps.Animation.DROP}
        />
      </GoogleMap>
    </motion.div>

  ) : <></>
}


export default App

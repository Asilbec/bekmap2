import React, { useEffect, useState } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import mapStyles from "./mapStyle/mapStyles";
import countryList from './randomCountry/randomPull'
import './App.css'
import axios from 'axios'

const mapContainerStyle = {
  height: "100%",
  width: "100vw",
};


function App() {
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU"
  })
  const [mapz, setMap] = React.useState(null)
  const onLoad = React.useCallback(function callback(map) {
    setMap(map)
    console.log(mapz)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
  const OPTIONS = {
    disableDefaultUI: true,
    keyboardShortcuts: false,
    zoomControl: true,
    styles: mapStyles,
  }
  function onMapClick(e) {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCea_aNWrtFKwa63zn0e3xpkpBTe2QYAFU').then(function (response) {
      const country = response.data.results[(response.data.results).length - 1]
      const formatted = country.formatted_address
      console.log(formatted.replace())
      console.log(currentCountry)
      if (formatted.replace('&', 'and') === currentCountry) {
        newCounter(counter + 1)
        generateNewList()
      }
      else {
        newCounter(counter - 1)
        generateNewList()
      }
    })
  }

  const [center, newCenter] = useState(
    { lat: -3.745, lng: -38.523 }
  )

  const [currentCountry, newCountry] = useState('')
  const [counter, newCounter] = useState(0)

  function generateNewList() {
    newCountry(countryList[Math.floor(Math.random() * 243)])
  }

  useEffect(() => {
    generateNewList()
    newCenter({ lat: -3.745, lng: -38.523 })
  }, []);


  return isLoaded ? (
    <div style={{ height: '100vh' }}>
      <div className='search'>
        <p>{currentCountry}</p>
        <p>{counter}</p>
      </div>


      <GoogleMap
        id='google-map-script'
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={OPTIONS}
        onClick={(e) => onMapClick(e)}
        onLoad={onLoad}
        onUnmount={onUnmount}
        zoom={2}
      >
      </GoogleMap>

    </div>

  ) : <></>
}


export default App
import React,{ useEffect, useState } from "react";
import { CssBaseline,Grid } from "@material-ui/core";

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';
import { getPlacesData , getWeatherData } from "./api/guidemeAPI";
const App = () => {

  const [type, setType] = useState('hotels');
  const [rating, setRating] = useState('');
  
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places,setPlaces] = useState([]);
  
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState(null);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coordinates : {latitude,longitude}})=>{
          setCoordinates({lat:latitude,lng:longitude});                
    })
  },[]);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [rating]);
  
  useEffect(()=>{
    if (bounds) {
      setIsLoading(true);
      
      getWeatherData(coordinates.lat, coordinates.lng)
        .then((data) => setWeatherData(data));

       getPlacesData(type,bounds.sw , bounds.ne)
          .then((data)=>{
          setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
          setFilteredPlaces([]);
          setRating('');
          setIsLoading(false);
          });
        }
  }, [type,bounds]);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  };

  return (
      <> 
        <CssBaseline />
        <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad}/>
        <Grid container spacing={3} style={{width:'100%'}}>
          <Grid item xs={12} md={4}>
            <List 
            isLoading={isLoading}
            childClicked={childClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}/>
          </Grid>
          <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Map 
                setChildClicked={setChildClicked}
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                coordinates={coordinates}
                places={filteredPlaces.length ? filteredPlaces : places}
                weatherData={weatherData}
                />
          </Grid>
        </Grid>  
        </>
  );
};

export default App;

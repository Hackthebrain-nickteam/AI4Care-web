// src/app/api/nearby-ers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { number } from 'zod';
const apiKey = process.env.GOOGLE_MAPS_API_KEY; 
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
 // Store your key in .env.local

  if (!latitude || !longitude) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }

  const radius = 2000;
  const type = 'hospital';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&type=${type}&keyword=emergency&key=${apiKey}`;

  const response = await fetch(url);
  
  const data = await response.json();
 
 let result = await Promise.all(data.results.map(async (place:any) => {
    let distance =  await getDistanceAPI(place.geometry.location.lat,place.geometry.location.lng, parseInt(latitude), parseInt(longitude) );
    console.log(place);
    return {...place, distance:distance.rows[0].elements[0].distance.text}
  }))
console.log(result);
  return NextResponse.json(result);
  
}
async function getDistanceAPI(lat1: number, lon1: number, lat2: number, lon2: number){
    const url = ` https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&key=${apiKey}`;

  const response = await fetch(url);
  return await response.json();
   
}
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  }
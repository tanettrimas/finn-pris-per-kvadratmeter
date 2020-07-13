import createEnturService from '@entur/sdk'
import axios from 'axios'

import secondsToMinutes from '../helpers/secondsToMinutes'
import getDateHoursMin from '../helpers/getDateHoursMin'


const journeyPlannerService = createEnturService({
  clientName: "tanettrimas-finnprisperkvadratmeter",
});

async function getBaseTripInformation(fromPlace, toPlace) {
  try {
    const [fromData, toData] = await Promise.all([journeyPlannerService.getFeatures(fromPlace), journeyPlannerService.getFeatures(toPlace)])
    // TODO: Replace this to make the user choose their prefered from/to from the autocomplete
    // Use localstorage
    const from = fromData[0]
    const to = toData[0]
    
    const [lngFrom, latFrom] = from.geometry.coordinates
    const [lngTo, latTo] = to.geometry.coordinates
    return {
      destinations: {
        from: {
          name: from.properties.name,
          label: from.properties.label,
          category: from.properties.category,
          street: from.properties.street,
          housenumber: +from.properties.housenumber,
          coordinates: [lngFrom, latFrom]
        }, 
        to: {
          name: to.properties.name,
          label: to.properties.label,
          category: to.properties.category,
          street: to.properties.street,
          housenumber: +to.properties.housenumber,
          coordinates: [lngTo, latTo]
        }
      },
      baseTripMetadata: {
        to: {
          coordinates: { latitude: latTo, longitude: lngTo },
          place: to.properties.source_id,
        }, 
        from: {
          coordinates: {
            latitude: latFrom, 
            longitude: lngFrom
          },
          place: from.properties.source_id,
        }
      }
    }
  } catch (error) {
  }
}

export default async function findTrips(from, to) {
  try {
    const baseTripData = await getBaseTripInformation(from, to);
    const [trips, non_transit] = await Promise.all([journeyPlannerService.getTripPatterns(baseTripData.baseTripMetadata), getNonTransit(baseTripData.baseTripMetadata)]) 
    const nonTransitTrip = Object.keys(non_transit.tripPatterns).reduce((acc, key) => {
      const current = non_transit.tripPatterns[key]
      acc[key] = {
        mode: key,
        duration: secondsToMinutes(current.duration),
        startTime: getDateHoursMin(current.startTime),
        endTime: getDateHoursMin(current.endTime),
        legs: current.legs,
        ...(key === 'foot' ? {
          distance: Math.floor(current.walkDistance)
        } : {
          distance: Math.floor(current.distance)
        })
      }
      return acc
    }, {})
    const tripData = trips.map(({ legs, startTime, endTime, duration }) => {
      const stages = legs.map(({ distance, mode, fromPlace, toPlace, line, duration }) => {
        const ext = {
          distance: Math.floor(distance),
          minutes: secondsToMinutes(duration),
          mode,
          from: {
            name: fromPlace.name,
            coords: [fromPlace.longitude, fromPlace.latitude],
            ...(fromPlace.quay && {
              id: fromPlace.quay.stopPlace.id
            })
          },
          to: {
            name: toPlace.name,
            coords: [toPlace.longitude, toPlace.latitude],
            ...(toPlace.quay && {
              id: toPlace.quay.stopPlace.id
            })
          },
          ...(line && {
            lineName: line.name,
            lineNumber: line.publicCode,
            lineId: line.id,
            ...(line.notices.length && line.notices)
          })
        }
        return ext
      })
      return {
        destinations: baseTripData.destinations,
        transit: {
          duration: secondsToMinutes(duration),
          legs: stages,
          startTime: getDateHoursMin(startTime),
          endTime: getDateHoursMin(endTime)
        },
        non_transit: nonTransitTrip
      }
    })
    
    return tripData.sort((a, b) => a.duration > b.duration)
  } catch (error) {
    console.error(error);
  }
}

async function getNonTransit({ from, to }) {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.entur.io/client/search/v1/non-transit",
      data: {
        from,
        to,
        searchDate: new Date().toISOString(),
        arriveBy: false,
        walkSpeed: 1.3,
      },
    });
    return response.data
  } catch (error) {
    console.error(error.response);
  }
}
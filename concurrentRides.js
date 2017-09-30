const fs = require( 'fs' )
const Path = require( 'path' )
const promisify = require( './promisify')
const readFile = promisify( fs.readFile )

const timeSort = ( a, b ) => {
  return new Date( '1970/01/01 ' + a.time) - new Date( '1970/01/01 ' + b.time)
}

const processString = ( buffer ) => buffer.toString().trim()

const parseTimeWindows = ( processedString ) => {
  const timeWindows = processedString.split('\n')

  const timeDataPoints = timeWindows.reduce( (memo, timeWindow) => {
    const startAndEndTime = timeWindow.split(', ')
    memo.push( { time:startAndEndTime[0], interval: 'start' })
    memo.push( { time:startAndEndTime[1], interval: 'end' } )
    return memo
  }, [])

  return timeDataPoints.sort( timeSort )
}

const caclulateConcurentRidesByInterval = ( timeDataPoints ) => {
  let currentRides = 0

  return timeDataPoints.reduce( (memo, timeDataPoint, index, array ) => {

    if( array[index + 1] !== undefined ){
      // check to see if a bike ride has finished
      timeDataPoint.interval === 'start'? currentRides++ : currentRides--
      // create an interval tuple
      memo.push( [timeDataPoint.time, array[index+1].time, currentRides] )
    } else {
      currentRides--
    }

    return memo
  }, [] )
}

const removeDuplicateWindows = ( intervalTuples ) =>
  intervalTuples.filter( item => item[0] !== item[1] )

const printOutTuples = ( intervalTuples ) => {
  intervalTuples.forEach( tuple => {
    console.log(`${tuple[0]}, ${tuple[1]}, ${tuple[2]}`)
  })

  return intervalTuples
}

const listConcurentRides = ( file ) => {
  return readFile(Path.resolve( __dirname , 'input/input1.txt' ))
    .then( processString )
    .then( parseTimeWindows )
    .then( caclulateConcurentRidesByInterval )
    .then( removeDuplicateWindows )
    .then( printOutTuples )
}

module.exports = {
  processString,
  parseTimeWindows,
  caclulateConcurentRidesByInterval,
  removeDuplicateWindows,
  printOutTuples,
  listConcurentRides
}

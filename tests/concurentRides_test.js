const { expect } = require('chai');
const {
  processString,
  parseTimeWindows,
  caclulateConcurentRidesByInterval,
  printOutTuples,
  removeDuplicateWindows,
  listConcurentRides } = require('../concurrentRides.js')


describe( 'processString()', () => {
  it( 'exists', () => {
    expect(processString).to.be.a('function')
  })

  describe( 'creates an string from a buffer', () => {
    const fileContents = processString( '7:13 AM, 7:23 AM\n6:50 AM, 7:08 AM\n7:10 AM, 7:30 AM\n6:52 AM, 7:33 AM\n6:58 AM, 7:23 AM')

    it( 'returns an string', () => {
      expect(fileContents).to.be.a('string')
    })
  })
})

describe( 'parseTimeWindows()', () => {
  it( 'exists', () => {
    expect(parseTimeWindows).to.be.a('function')
  })

  describe( 'Creates an array of time intervals', () => {
    const timeIntervals = parseTimeWindows('7:13 AM, 7:23 AM\n6:50 AM, 7:08 AM\n7:10 AM, 7:30 AM\n6:52 AM, 7:33 AM\n6:58 AM, 7:23 AM')

    it( 'returns an array of time intervals', () => {
      expect( timeIntervals.length ).equal(10)
    })

    it( 'array items are in the correct format', () => {
      expect( timeIntervals ).deep.equal([
        { time:'6:50 AM', interval: 'start' },
        { time:'6:52 AM', interval: 'start' },
        { time:'6:58 AM', interval: 'start' },
        { time:'7:08 AM', interval: 'end' },
        { time:'7:10 AM', interval: 'start' },
        { time:'7:13 AM', interval: 'start' },
        { time:'7:23 AM', interval: 'end' },
        { time:'7:23 AM', interval: 'end' },
        { time:'7:30 AM', interval: 'end' },
        { time:'7:33 AM', interval: 'end' }
      ])
    })
  })
})

describe( 'caclulateConcurentRidesByInterval()', () => {
  it( 'exists', () => {
    expect(caclulateConcurentRidesByInterval).to.be.a('function')
  })

  const intervals = caclulateConcurentRidesByInterval([
    { time:'6:50 AM', interval: 'start' },
    { time:'6:52 AM', interval: 'start' },
    { time:'6:58 AM', interval: 'start' },
    { time:'7:08 AM', interval: 'end' },
    { time:'7:10 AM', interval: 'start' },
    { time:'7:13 AM', interval: 'start' },
    { time:'7:23 AM', interval: 'end' },
    { time:'7:23 AM', interval: 'end' },
    { time:'7:30 AM', interval: 'end' },
    { time:'7:33 AM', interval: 'end' }
  ])


  describe( 'transforms array of time data points into array of interval tuples', () => {

    it( 'Returns array of interval tuples', () => {
      expect( intervals ).deep.equal([
        [ '6:50 AM', '6:52 AM', 1 ],
        [ '6:52 AM', '6:58 AM', 2 ],
        [ '6:58 AM', '7:08 AM', 3 ],
        [ '7:08 AM', '7:10 AM', 2 ],
        [ '7:10 AM', '7:13 AM', 3 ],
        [ '7:13 AM', '7:23 AM', 4 ],
        [ '7:23 AM', '7:23 AM', 3 ],
        [ '7:23 AM', '7:30 AM', 2 ],
        [ '7:30 AM', '7:33 AM', 1 ]
      ])
    })
  })
})

describe( 'removeDuplicateWindows()', () => {
  it( 'exists', () => {
    expect(removeDuplicateWindows).to.be.a('function')
  })

  const noDups = removeDuplicateWindows([
    [ '6:50 AM', '6:52 AM', 1 ],
    [ '6:52 AM', '6:58 AM', 2 ],
    [ '6:58 AM', '7:08 AM', 3 ],
    [ '7:08 AM', '7:10 AM', 2 ],
    [ '7:10 AM', '7:13 AM', 3 ],
    [ '7:13 AM', '7:23 AM', 4 ],
    [ '7:23 AM', '7:23 AM', 3 ],
    [ '7:23 AM', '7:30 AM', 2 ],
    [ '7:30 AM', '7:33 AM', 1 ]
  ])

  it( 'Removes all intervals where start and end time are equal', () => {
    expect( noDups ).deep.equal([
      [ '6:50 AM', '6:52 AM', 1 ],
      [ '6:52 AM', '6:58 AM', 2 ],
      [ '6:58 AM', '7:08 AM', 3 ],
      [ '7:08 AM', '7:10 AM', 2 ],
      [ '7:10 AM', '7:13 AM', 3 ],
      [ '7:13 AM', '7:23 AM', 4 ],
      [ '7:23 AM', '7:30 AM', 2 ],
      [ '7:30 AM', '7:33 AM', 1 ]
    ])
  })
})

import * as d3Fetch from 'd3-fetch'

const knownCountries = ['US', 'China', 'Russia']

async function parseData(satelliteURL, targetsURL) {
  const satellitePromise = d3Fetch.csv(satelliteURL)
  const targetsPromise = d3Fetch.csv(targetsURL)

  let data = Promise.all([satellitePromise, targetsPromise]).then(res => {
    const [satelliteData, targetsData] = res

    satelliteData.forEach(d => {
      d.is_satellite = true
      d.is_target = false
    })

    targetsData.forEach(d => {
      d.is_satellite = false
      d.is_target = true
    })

    const combinedData = [...satelliteData, ...targetsData]

    combinedData.forEach(d => {
      d.date = new Date(d.timestamp).getTime()
      d.include = d.include == 'TRUE' ? true : false
      d.longitude = +d.longitude
      d.x_coord = +d.x_coord
      d.y_coord = +d.y_coord
      d.country = d.sat_operator

      if (d.country.includes('U.S.')) {
        d.country = 'US'
      }

      if (!knownCountries.includes(d.country)) {
        d.country = 'Other'
      }
    })

    const timestamps = Array.from(
      new Set([...combinedData.map(d => d.timestamp)])
    )

    const satellites = Array.from(
      new Set([...combinedData.map(d => d.sat_name)])
    )

    let dataset = new Map()

    timestamps.forEach((timestamp, i) => {
      let entries = []
      satellites.forEach(satellite => {
        const result = combinedData.filter(
          d => d.timestamp === timestamp && d.sat_name === satellite
        )

        if (result.length) {
          entries.push(result[0])
        }
      })
      dataset.set(new Date(timestamp).getTime(), entries)
    })

    const sortedData = new Map(Array.from(dataset).sort((a, b) => a[0] - b[0]))

    return sortedData
  })

  // let data = await d3Fetch
  //   .csv(url, d => {
  //     d.date = new Date(d.timestamp).getTime()
  //     d.include = d.include == 'TRUE' ? true : false
  //     d.longitude = +d.longitude
  //     d.x_coord = +d.x_coord
  //     d.y_coord = +d.y_coord
  //     return d
  //   })
  //   .then(data => {
  //     data = data.filter(d => d.include)

  //     const timestamps = Array.from(
  //       new Set([...data.map(d => d.timestamp)])
  //     ).sort((a, b) => a - b)

  //     const satellites = Array.from(new Set([...data.map(d => d.sat_name)]))

  //     let dataset = new Map()
  //     // let dataset = []

  //     timestamps.forEach(timestamp => {
  //       let entries = []
  //       satellites.forEach(satellite => {
  //         entries.push(
  //           data.filter(
  //             d => d.timestamp === timestamp && d.sat_name === satellite
  //           )[0]
  //         )
  //         // dataset.push(
  //         //   data.filter(
  //         //     d =>
  //         //       d.timestamp === timestamp && d.sat_name === satellite
  //         //   )[0]
  //         // )
  //       })
  //       dataset.set(new Date(timestamp).getTime(), entries)
  //     })
  //     return dataset
  //   })

  return data
}

export default parseData

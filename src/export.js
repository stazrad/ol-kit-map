import olFormatGeoJSON from 'ol/format/geojson'
import olFormatKml from 'ol/format/kml'
import { saveAs } from 'file-saver'

export function groupBy (list, getGroupName) {
  return list.reduce((groups, item) => {
    const val = getGroupName(item)

    groups[val] = groups[val] || []
    groups[val].push(item)

    return groups
  }, {})
}

/**
 * Exports the passed features as a file of the desired type.
 * @function exportFeatures
 * @since 6.5.0
 * @param {String} [type] - The desired file type ('shp' or 'kml').
 * @param {Object[]} [features] - An array of the features to be included in the generated file.
 */
export function exportFeatures (type, features) {
  const routes = {}
  const safeFeatures = features.map(feature => {
    const clone = feature.clone()

    // this removes a ref to _ol_kit_parent to solve circularJSON bug
    clone.set('_ol_kit_parent', null)

    return clone
  })

  const getExportFileContents = () => {
    if (type === 'shp') {
      return exportShapefile({
        format: new olFormatGeoJSON(),
        visibleFeatures: safeFeatures,
        conversionEndpoint: routes.geoJsonConverter,
        sourceProjection: 'EPSG:3857'
      })
    } else if (type === 'kml') {
      return exportKml({ format: new olFormatKml(), visibleFeatures: safeFeatures, sourceProjection: 'EPSG:3857', targetProjection: 'EPSG:4326' })
    }
  }

  return getExportFileContents().then(({ blob, filename }) => saveAs(blob, filename))
}

export function exportShapefile (args) {
  const {
    format,
    visibleFeatures,
    sourceProjection,
    targetProjection = 'EPSG:4326',
    conversionEndpoint
  } = args
  const flattenedFeatures = format.writeFeaturesObject(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  }).features

  const exportableGroups = groupGeoJsonByType(flattenedFeatures)

  const opts = {
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data'
    },
    responseType: 'blob',
    body: JSON.stringify({
      'groups': exportableGroups
    })
  }

  return new Promise((resolve, reject) => {
    return fetch(conversionEndpoint, opts)
      .then(res => {
        if (!res.ok) return reject(res.status)

        return res.blob()
      })
      .then(res => {
        const blob = new Blob([res], { type: 'application/octet-stream' })
        const filename = 'export.zip'

        return resolve({ blob, filename })
      })
      .catch(error => {
        console.error(error) // eslint-disable-line
      })
  })
}

export function exportKml (args) {
  const {
    format,
    visibleFeatures,
    sourceProjection,
    targetProjection = 'EPSG:4326'
  } = args
  console.log(args)
  const source = format.writeFeatures(visibleFeatures, {
    dataProjection: targetProjection,
    featureProjection: sourceProjection
  })
  const blob = new Blob([source], { type: 'kml' })
  const filename = 'export.kml'

  return Promise.resolve({ blob, filename })
}

export function smoothFeatureAttributes (geojsonFeatures) {
  let allProps = {}

  // create an object of props as keys (since it takes care of dupes) & then grab just the keys
  geojsonFeatures.forEach(feature => {
    if (!feature.properties) feature.properties = {}
    Object.keys(feature.properties).forEach(function (prop) { allProps[prop] = true })
  })
  allProps = Object.keys(allProps)

  // for each feature determine if the prop should be removed or set to ''
  // an empty string corresponds to a null value in the output shapefile
  return geojsonFeatures.map(feature => {
    allProps.forEach(prop => {
      const hasProp = feature.properties.hasOwnProperty(prop)
      const propIsNull = feature.properties[prop] === null
      const isVmfProp = prop.startsWith('_vmf_')

      if (isVmfProp) {
        delete feature.properties[prop]
      } else if (!hasProp || (hasProp && propIsNull)) {
        feature.properties[prop] = ''
      }
    })

    return feature
  })
}

export function groupGeoJsonByType (featuresArray) {
  const groupedFeatures = groupBy(featuresArray, feature => feature.geometry.type)

  return Object.keys(groupedFeatures).map(geomType => {
    return {
      name: geomType,
      json: {
        type: 'FeatureCollection',
        features: smoothFeatureAttributes(groupedFeatures[geomType])
      }
    }
  })
}

const promisify = ( callback ) => {
return ( params ) => new Promise( ( resolve, reject ) => {
    callback( params, ( error, result ) => {
      if( error ){
        reject( error )
      } else {
        resolve( result )
      }
    })
  })
}

module.exports = promisify

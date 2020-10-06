'use strict';

const fs   = require('fs')
    , http = require('http')
    , chalk = require("chalk")              //  Console Colors
    , Cache = require('@archivistnerd/filecache')          //  File Cache Functions
    , onKeypress = require('@archivistnerd/onkeypress')    //  onkeypress function
    ;
/*
      Archivist's Cache Server 'HTTP' Main Code
*/
function ACS(){
  const t404 = chalk.red.bold('404')
      , t200 = chalk.green.bold('200')
      ;
  function serve(port,host,path,cacheFile){
    let cache = Cache()
      , Mime = require('mime')
      , server = http.createServer( (request, response) => {
          let url = request.url.split('?').shift()
            , filename = (url.split('').pop() === '/')? `${url}index.html`:url
            , filepath = (`${publicFolder}${filename}`).replace('//','/')
            , mime = Mime.getType( filename )
            ;
          fs.readFile(filepath, function(err, data) {
            if (err) {
              console.log(`${t404}\t${request.method}\t\t\t\t\t${request.url}`)
              response.statusCode = 404
              return response.end('File not found or you made an invalid request.')
            }
            console.log(`${t200}\t${request.method}\t${(cache.bytes()/1024).toFixed(2)}KB\t${data.length}b\t${mime}\t${request.url}`)
            if (cacheFile) cache.add( url, mime, data )
            response.setHeader('Content-Type', mime)
            response.end(data)
          })
        })
      ;
    server.listen(port, host, ()=>{
      console.log( 'serving', { path,port,cacheFile } )
      onKeypress( ()=>{
        if (cacheFile) cache.save( cacheFile )
        process.exit(0)
      })
    })
    return this
  }

  function cached(port,host,cacheFile){
    let cache = Cache()
                  .load ( cacheFile )
      , server = http.createServer( (request, response) => {
          let url = request.url.split('?').shift()
            , file = cache.data[ url ]
            ;
          if ( typeof file == 'undefined' ){
              console.log(`${t404}\t${request.method}\t\t\t\t\t${request.url}`)
              response.statusCode = 404
              return response.end('File not found or you made an invalid request.')
          }
          console.log(`${t200}\t${request.method}\t${(cache.bytes()/1024).toFixed(2)}KB\t${file.data.length}b\t${file.mime}\t${request.url}`)
          response.setHeader('Content-Type', file.mime)
          response.end(file.data)
        })
    ;
    server.listen(port, host, ()=>{
      console.log( 'serving cache', { port,cacheFile } )
      onKeypress( ()=>process.exit(0) )
    })
    return this
  }

  function pack(path,cacheFile){
    let cache = Cache()
        .pack( path )
        .save( cacheFile )
      ;
    console.log( 'packed',cacheFile,{ files: cache.list().length, bytes: cache.bytes() })
    return this
  }

  function unpack(cacheFile,path){
    let cache = Cache()
        .clear()
        .load( cacheFile )
        .unpack( path )
      ;
    console.log( 'unpacked',path, { files: cache.list().length, bytes: cache.bytes() })
    return this
  }

  return {
    serve,
    cached,
    pack,
    unpack,
  }
}

module.exports = ACS();
const request = require('request');
const http = require('http')
const handler = (req, res) => {
  if(req.url == "/racer"){
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      opts = (JSON.parse(body))
      console.log('opts',opts)
      opts.gzip = true
      opts.followRedirect = false
      if(!opts.parallel) opts.parallel = 5 // default parallelization
      for(var i=0;i<opts.parallel;i++){
        request(opts, function(err,resp,body){
          if(err){
            console.log(err);
            return false;
          }
          try{
            status = resp.statusCode + " [len " + body.length + "] " +body.substr(0,500)
            if(resp.headers["Location"]) status+=resp.headers["Location"]
            console.log(status);
          }catch(e){ console.log('Error', e) }
        })    
      }
    });    
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200);
  res.end('racer');
}

server = http.createServer(handler).on('error', (err) => {console.log('Error', err)})
server.listen(8099, '127.0.0.1', function(err){process.stdout.write("Running at 8099");});
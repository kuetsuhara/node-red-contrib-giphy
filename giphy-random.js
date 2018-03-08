let https = require('https');

module.exports = function(RED) {
    function GiphyRandomNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {

            this.giphy_host = 'api.giphy.com';
            this.path       = '/v1/gifs/random';
            this.api_key    = config.apikey;
            this.tag        = config.tag;
            this.rating     = '';
            this.fmt        = 'json'

            var requestURL = 'https://';
            requestURL += this.giphy_host;
            requestURL += this.path;
            requestURL += '?api_key=' + this.api_key;
            if(this.tag){
                requestURL += '&tag=' + this.tag;
            }
            if(this.rating){
                requestURL += '&rating=' + this.rating;
            }
            if(this.fmt){
                requestURL += '&fmt=' + this.fmt;
            }
            
            https.get(requestURL, (res) => {
                let body = '';
                res.setEncoding('utf8');
              
                res.on('data', (chunk) => {
                    body += chunk;
                });
              
                res.on('end', (res) => {
                    res = JSON.parse(body);
                    msg.payload = res;
                    // msg.payload = body;
                    console.log(res);
                    node.send(msg);
                });
              }).on('error', (e) => {
                console.log(e.message); //エラー時
                msg.payload = e.message;
                node.send(msg);
            });

            // node.send(msg);
        });
    }
    RED.nodes.registerType("giphy-random",GiphyRandomNode);
}
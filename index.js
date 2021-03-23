const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();


app.get('/', function(req, res){
    let birthMonth = req.query.birthMonth;

    request({
        method: 'GET',
        url: 'https://www.ntv.co.jp/sukkiri/sukkirisu/'
    }, (err, response, body) => {

        if (err) return console.error(err);

        let $ = cheerio.load(body);

        let rankMap = new Map;
        let descriptionMap = new Map;
        let first = true;
        $('div[class="ntv-article-contents-main"]').children().children().each(function (index, element) {
            let rank = $(element).find('div[class="row1"] > div').text();
            let month = $(element).find('div[class="row1"] > p').text();
            if(rank !== ""){
                rankMap.set(month, rank);
            }
            else{
                if(first){
                    rankMap.set(month, '12位');
                    first = false;
                }
                else{
                    rankMap.set(month, '1位');
                }
            }
        });
        console.log(rankMap);

        var json = {
            rank: rankMap.get(birthMonth + "月")
        };
        res.send(json);
    });
});

app.listen('8080');
console.log('API is running on http://localhost:8080');

module.exports = app;
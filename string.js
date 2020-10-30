// const exp = /(\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/
// const str = 'someti.yuym'

// const stp = str.match(exp).index

// console.log(str.trim().slice(0,str.match(exp).index))

const whois = require('whois')
const fs = require('fs')
const domains = ['google.com', 'stackoverflow.com', 'github.com']

domains.map(test => {
    whois.lookup(test, function(err, data) {
        if(err) throw err
        fs.appendFile('whos.json', data, err =>{
            if(err) throw err
        })
        console.log(data)
    })
})
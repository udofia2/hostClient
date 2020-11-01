const whois = require("whois");
const fs = require("fs");
const mongoose = require("mongoose");

const Domains = require("./../model/domain.model");

const domainActions = () => {
  //A function that makes a request to whois for available domains
  const newDomain = async (req, res) => {
    const { name } = req.body;
    

    //Takesn out the extension in a given domain
    const exp = /(\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/;

    const domainWithoutSuffix = name.slice(0, name.match(exp).index);

    const extensions = [
      ".com",
      ".org",
      ".net",
      ".int",
      ".edu",
      ".gov",
      ".mil",
      ".me",
      ".dev",
      ".tech",
      ".online",
      ".site",
      ".club",
      ".io",
      ".space",
    ];

    const whoisP = async (domain, opts = {}) => {
      //Makes a new lookup to whois
      return new Promise((resolve, reject) => {
        whois.lookup(domain, opts, async (err, data) => {
          if (err) reject(err);

          //informs users that the domain is available
          resolve(data);
          if (data.trim().startsWith("No")) {
            console.log(`${domain} is available`);
            return res.render("found", {
              domain
          });

          }

          //For domains that are not available, sugestions are made
          suggestions();
        });
      });
    };

    const suggestions = async () => {
      const recheck = extensions.map(async (sufix) => {
        const domainModified = `${domainWithoutSuffix}${sufix}`;

        whois.lookup(domainModified, async (err, data) => {
          if (err) throw err;

          if (data.trim().startsWith("Domain")) {
            console.log(`${domainModified} is taken`);
          } else {
            //saves availabe domains to the database
            const more = new Domains({
              name: domainModified,
            });
            await more.save();
            console.log(domainModified);
          }
        });
      });

      //waits for seconds before redirecting to fetch all available doamins from dtabase
      setTimeout(async () => {
        // const found = await Domains.find({})
        // return res.render('result', found)
        res.redirect("domain/result");
        
      }, 4000);

      //clear the database for a new request

      await mongoose.connection.db.dropCollection("domains", (err, result) => {
        console.log("Collection dropped");
      });
    };

    await whoisP(name);
  };

  const result = async (req, res) => {
    const found = await Domains.find({});
    res.render("result", {
      msg: `available domains`,
      found,
    });
  };

  const index = async (req, res) => {
    res.render("index")
  }

  return {
    newDomain,
    index,
    result,
    
  };
};

module.exports = domainActions;

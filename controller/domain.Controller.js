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
          if (data.trim().startsWith("No")) {
            resolve(data);
            console.log(`${domain} is available`);
            return res.render("found", {
              msg: `CONGRATULATIONS ${domain} is available. You can Proceed to register the doamin`,
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
      setTimeout(() => {
        res.redirect("/api/domain/hit");
        
      }, 2000);

      //clear the database for a new request

      await mongoose.connection.db.dropCollection("domains", (err, result) => {
        console.log("Collection dropped");
      });
    };

    await whoisP(name);
  };

  const display = async (req, res) => {
    const found = await Domains.find({});
    res.render("suggestions", {
      msg: `available domains`,
      found,
    });
  };

  const domains = async (req, res) => {
    res.render("search");
  };

  return {
    domains,
    newDomain,
    display,
  };
};

module.exports = domainActions;

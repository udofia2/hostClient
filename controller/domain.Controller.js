const whois = require("whois");
const fs = require("fs");
const domainActions = (Domains) => {
  const newDomain = async (req, res) => {
    const { name } = req.body;

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

    const whoisP = (domain, opts = {}) => {
      return new Promise((resolve, reject) => {
        whois.lookup(domain, opts, (err, data) => {
          if (err) reject(err);

          // fs.appendFile("whos.json", data, (err) => {
          //   if (err) throw err;
          // });
          if (data.trim().startsWith("No")) {
            resolve(data);
            console.log(`${domain} is available`);
            return res.json(`${domain} is available`);
          }

          suggestions();
        });
      });
    };

    const suggestions = async () => {
      const recheck = extensions.map(async (sufix) => {
        const domainModified = `${domainWithoutSuffix}${sufix}`;

        whois.lookup(domainModified, async (err, data) => {
          console.log("i got hit");
          if (err) throw err;

          if (data.trim().startsWith("Domain")) {
            console.log(`${domainModified} is taken`);
          } else {
            const more = new Domains({
              name: domainModified,
            });

            await more.save();
            console.log(domainModified);
          }
        });
      });

      const found = await Domains.find({});

      res.json({
        msg: `available domains`,
        found,
      });

      await Domains.deleteMany();
    };

    await whoisP(name);
  };

  const domains = async (req, res) => {
    res.render("domain");
  };

  return {
    domains,
    newDomain,
  };
};

module.exports = domainActions;

#!/usr/bin/env node

const fs = require('fs');
const emlformat = require('eml-format');

const eml = fs.readFileSync(process.argv[2] || 0, 'utf-8');
emlformat.read(eml, (error, data) => {
  if (error)
    return console.log(error);
  if (!data.text)
    return;
  const t = data.text.replace(/\r\n/g, '\n');
  if (process.env.DEBUG)
    console.dir(t);
  const re = /^(?:>\s)?\s(?<td>20[0-9][0-9]-[01][0-9]-[0123][0-9])\s\s(?<pd>20[0-9][0-9]-[01][0-9]-[0123][0-9])\s\s(?:[0-9]{4})\s\s(?<rmk>\S+(?:\s\S+)*)\s\s(?<tc>[A-Z]{3})\s\s(?<tf>-?[0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})\s\s(?<pc>[A-Z]{3})\s\s(?<pf>-?[0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})$/gm;
  let m;
  console.log('Transaction Date,Remark,Transaction Currency,Amount');
  while (m = re.exec(t)) {
    const o = {
      ...m.groups,
      rmk: m.groups.rmk.replace(/,/, '_'),
      tf: +m.groups.tf.replace(/,/, ''),
      bf: +m.groups.pf.replace(/,/, ''),
    };
    console.log(`${o.td},${o.rmk},${o.tc},${o.tf}`);
  }
});

const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const config = require(`${cwd}/config.json`);
const indexFilePath = path.resolve(`${cwd}`, 'template.html');

// checking files
console.log(`FILES: Config file: ${JSON.stringify(config)}\n\n Template file: ${indexFilePath}`)

if (!fs.existsSync(indexFilePath)){
  console.error(`FAILED: File "template.html" not found on the current directory.`);
  process.exit(1);
}

// building links

var linksList = ""

var socialLinksList = ""

config.menu_links.map(link => {
  if (link.hasOwnProperty("dropdown")) {
    let dropdown = ""
    link.dropdown.map(dd => {
      if (dd.hasOwnProperty("bio")) {
        dropdown += `<li class="biography"><img src="${dd.img_url}" /><p>${dd.bio}</p></li>`;
      } else {
        dropdown += `<li><a href="${dd.url}">${dd.name}</a></li>`;
      }
    })

    linksList += `<li><a href="${link.url}">${link.name}</a><ul class="dropdown">` + dropdown + `</ul></li>`;

  } else {
    linksList += `<li><a href="${link.url}">${link.name}</a></li>`;
  }
});

config.social_links.map(link => {
  socialLinksList += `<a href="${link.url}"><img class="social-image" src="${link.image}" /></a>`
})


// bulding page

let index = fs.readFileSync(indexFilePath, 'utf-8');

index = index.replace('{{links_feed}}', linksList);
index = index.replace('{{social_feed}}', socialLinksList);


for(key in config) {
  index = index.replace(new RegExp(`{{${key}}}`, 'g'), config[key] ? config[key] : '');
}

const date = new Date().toLocaleString('pt-br')

index = `<!-- This is an automatically generated file, do not edit it directly -->\n
<!-- Last updated in ${date} -->\n\n` + index;

// -------------------------------------- done

try {
  if (!fs.existsSync(path.resolve(`${cwd}`, 'index.html'))){
    console.error(`FAILED: File "index.html" not found on the current directory.`);
    process.exit(1);
  }

  fs.writeFileSync(path.resolve(`${cwd}`, 'index.html'), index);
  console.log('\ Building done');
} catch(err) {
  console.log('\n Building error: ', err)
}

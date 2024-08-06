const fs = require('fs');
const path = require('path');
const cwd = process.cwd();
const config = require(`${cwd}/config.json`);
const indexFilePath = path.resolve(`${cwd}`, 'assets/template.html');

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

index = '<!-- This is an automatically generated file, do not edit it directly -->\n' + index;

// -------------------------------------- done

fs.writeFileSync(path.resolve(`${cwd}`, 'index.html'), index);
console.log('\nBlog building done');
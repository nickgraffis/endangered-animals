import fs from 'fs'

const animals = []
let p = 1
function f(page) {
  fetch(`https://www.worldwildlife.org/species/directory${page ? `?page=${page}` : ''}`)
  .then(response => response.text())
  .then(html => {
    const table = html
      .replace(/\s/g, '')
      .replace(/\n/g, '')
      .match(/<tableclass="leadgutter-bottom-2table-to-list">(.*?)<\/table>/g)[0]
      .match(/<tbody>(.*?)<\/tbody>/g)[0]
      .match(/<tr(.*?)<\/tr>/g)
      .map(table => {
        const columns = table.match(/<td(.*?)<\/td>/g)
        const link = columns[0]
          .match(/href="(.*?)"/g)[0]
          .replace('href="', '')
          .replace('"', '')
        const commonName = columns[0]
          .replace('<tdclass="keep">', '')
          .replace('</td>', '')
          .split('>')[1]
          .split('<')[0]
          .replace(/&#39;/g, '\'')
          .split('')
          .map(char => char.toUpperCase() === char ? ' ' + char : char)
          .join('')
          .trim()
        animals.push({
          common_name: commonName,
          link: 'https://www.worldwildlife.org' + link
        })
      })
      if (p === 1) {
        p++ 
        f(p)
      } else {
        getAllAnimals()
      }
  })
}

async function getAllAnimals() {
  for (let i = 0; i < animals.length; i++) {
    let animal = await getAnimal(animals[i].link, animals[i].common_name)
    fs.writeFileSync(`./data/${animals[i].common_name.replace(' ', '_').toLowerCase()}.json`, JSON.stringify(animal))
  }
}

function getAnimal(link, name) {
  return fetch(link)
  .then(response => response.text())
  .then(html => {
    // find the div with a class wysiwyg lead
    let wysiwyg = html.split('<div class="wysiwyg lead">')[1]?.split('</div>')[0]
    let paragraphs = wysiwyg?.split('<p>').map(p => p.replace('</p>', '')).join('\n')
    let list = html.split('<ul class="list-data list-stats list-items">')[1]?.split('</ul>')[0]
    let data = {}
    let locationsList = html.split('<ul class="list-data list-spaced">')[1]?.split('</ul>')[0]
    let locations = []
    locationsList?.split('<a').map(a => {
      let l = a.split('>')?.[1]?.split('</a>')?.[0].replace('</a', '')
      locations.push(l)
    })
    let stats = list?.split('<li>').map(li => {
      let title = li.replace('</li>', '').split('<strong class="hdr">')?.[1]?.split('</strong>')[0]
      let d = li.replace('</li>', '').split('<div class="container">')?.[1]?.split('</div>')[0]?.trim()
      data[title] = d
      if (title === 'Population') {
        // match the first number including comma
        let popNum = d.match(/\d+[,\d+]*/g)?.[0].replace(',', '')
        data[title] = Number(popNum)
      }
    })
    data.description = paragraphs?.trim()
    data.locations = locations.filter(l => !l?.includes('<strong class="hdr"'))
    data.name = name
    console.log(data)
    return data
  })
}

f()
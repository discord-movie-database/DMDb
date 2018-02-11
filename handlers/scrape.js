const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const scrape = module.exports = {};

scrape.top = async () => {
    const raw = await superagent.get('http://www.imdb.com/chart/top');
    const $ = cheerio.load(raw.text);

    const titles = [];
    await $('table.chart tbody tr').each((i, el) => {
        titles[i] = {
            "name": $(el).find('.titleColumn a').text(),
            "year": $(el).find('.titleColumn span').text().slice(1, -1),
            "rating": $(el).find('.ratingColumn.imdbRating').text().replace('\n', '').trim(),
            "id": $(el).find('.watchlistColumn > div').attr('data-tconst'),
            "poster": $(el).find('.posterColumn img').attr('src')
        };
    });

    if (titles.length !== 250) {
        console.error('Error getting all top 250 titles with scraper.');
        return false;
    }
    
    fs.writeFileSync('top.json', JSON.stringify(titles));

    return true;
}

scrape.top();
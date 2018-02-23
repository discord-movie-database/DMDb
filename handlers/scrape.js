const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const scrape = module.exports = {};

scrape.top = async () => {
    const raw = await superagent.get('http://www.imdb.com/search/title?groups=top_250&adult=include&count=250&sort=user_rating,desc').set('X-Forwarded-For', '1.2.3.0');
    const $ = cheerio.load(raw.text);

    const top = {
        "titles": [],
        "timeOfScrape": new Date().getTime()
    };

    await $('.list .lister-list .lister-item').each((i, elem) => {
        top.titles[i] = {
            "name": $(elem).find('.lister-item-header a').text(),
            "year": $(elem).find('.lister-item-header .lister-item-year').text().split(' ').pop().slice(1, -1),
            "rating": $(elem).find('.ratings-bar .ratings-imdb-rating').text().trim(),
            "metascore": $(elem).find('.ratings-bar .ratings-metascore .metascore').text().trim(),
            "id": $(elem).find('.lister-item-header a').attr('href').split('/')[2],
            "poster": $(elem).find('.lister-item-image img').attr('src'),
            "rated": $(elem).find('.text-muted .certificate').text(),
            "runtime": $(elem).find('.text-muted .runtime').text(),
            "genre": $(elem).find('.text-muted .genre').text().trim().split(', '),
            "votes": $(elem).find('.sort-num_votes-visible span[name="nv"]').first().text(),
            "gross": $(elem).find('.sort-num_votes-visible span[name="nv"]').last().text(),
            "plot": $(elem).find('.lister-item-content > .text-muted').last().text().trim(),
            "index": i
        }
    });

    if (top.titles.length !== 250) {
        console.error('Error getting all top 250 titles with scraper.');
        return false;
    }
    
    console.log('Scraped new top data.');
    fs.writeFileSync('top.json', JSON.stringify(top));

    return top;
}
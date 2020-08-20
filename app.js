const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    })
    await page.goto('https://spotifycharts.com/regional/id/daily/latest')

    const songList = await page.evaluate(() => {
        const result = []
        document.querySelectorAll('.chart-table-track>strong')
            .forEach(el => result.push(el.innerText))
        return result
    })

    const artistList = await page.evaluate(() => {
        const result = []
        document.querySelectorAll('.chart-table-track>span')
            .forEach(el => result.push(el.innerText.replace('by ', '')))
        return result
    })

    const totalStreams = await page.evaluate(() => {
        const result = []
        document.querySelectorAll('td.chart-table-streams')
            .forEach(el => result.push(el.innerText))
        return result
    })

    const trendList = await (async () => {
        const result = []
        songList.forEach((list, index) => result.push({
            song: list,
            artist: artistList[index],
            streamCount: totalStreams[index]
        }))
        return result
    })()

    const ranking = await (async () => {
        return (trendList.findIndex(pos => pos.artist == 'Mahalini')) + 1
    })()


    console.log('Lagu Aku yang Salah - Mahalini x Nuca ada di posisi', ranking)

    await browser.close()
})()
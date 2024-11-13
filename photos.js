import fs from "node:fs"
import OpenAI from "openai"
import axios from 'axios'

async function download(url, filepath) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    })
    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(filepath))
    })
}
  
async function generateIMG(imgNum, prompt) {
    const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})

    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Sztuczna inteligencja. "+prompt,
        n: 1,
        size: "1024x1024",
      })

    download(response.data[0].url, "image_placeholder"+imgNum+".jpg")
}

async function generateAllIMGs(alts) {
    let pool = []

    for (let i = 0; i < alts.length; i++) {
        pool.push(generateIMG(i +  1, alts[i]));
    }

    try {
        await Promise.all(pool);
    } catch (err) {
        console.error(err);
    }
}

try {
    var startDT = new Date()

    console.log("OPENAI TASK START: "+startDT)

    const data = fs.readFileSync('podglad.html', 'utf8')

    const imgRegex = /\<img src\=\'[\w.]+\' alt=\'[\w\s.ąĄćĆeĘłŁóÓśŚżŻźŹ]+\' \/\>/g
    const imgs = data.match(imgRegex)

    const altRegex1 = /\<img src\=\'[\w.]+\' alt=\'/g
    const altRegex2 = /\' \/\>/g

    var alts = []

    imgs.forEach((img) => {
        alts.push(img.replace(altRegex1, "").replace(altRegex2, ""))
    })

    await generateAllIMGs(alts)

    var stopDT = new Date()
    var aiDT = (stopDT-startDT) / 1000

    console.log("OPENAI TASK FINISH: "+stopDT)
    console.log("Open AI took "+aiDT+"s to respond to the command.")

    const imgRepRegex = /<img src=\'[a-zA-Z_.]+\'/

    var res = data

    for (var index = 1; index <= alts.length; index++) {
        res = res.replace(imgRepRegex, "<img src='image_placeholder"+index+".jpg'")
    }

    try {
        fs.writeFileSync("podglad_zdjecia.html", res)
        console.log("View with photos saved to file 'podglad_zdjecia.html'")
    } catch (err) {
        console.error(err)
    }

} catch (err) {
    console.error(err)
}
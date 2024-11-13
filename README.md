
[PL]
# JAK GO URUCHOMIĆ

1. Zainstaluj zależności.
`npm install`

2. Edytuj plik .env.
`OPENAIAPI_KEY=„TWÓJ KLUCZ OPEN AI API”`

3. Uruchom aplikację.
Generowanie artykułu z podanego tekstu: `node --env-file=.env index.js`

Generowanie podglądu i szablonu z wygenerowanego artykułu: `node --env-file=.env fullside.js`

Generowanie zdjęć i dodawanie ich na wygenerowany podgląd: `node --env-file=.env photos.js`

# JAK TO DZIAŁA

Kod jest bardzo prosty, a to uproszczony opis działania.

- `index.js`
1. plik .txt z tekstem artykułu jest otwierany i zapisywany w zmiennej.
```javascript
const data = fs.readFileSync('Zadanie dla JJunior AI Developera - tresc artykulu.txt', 'utf8');
```
2. tekst i polecenie są przekazywane do OpenAI.
```javascript
const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { 
            role: "system", 
            content: "..."},
        {
            role: "user",
            content: data,
        },
    ],
});
```
3. OpenAI odsyła odpowiedź.
4. odpowiedź jest zapisywana do pliku `artykul.html`.
```javascript
fs.writeFileSync("artykul.html", completion.choices[0].message.content);
```
- `fullside.js`
1. plik `artykul.html` z artykułem jest otwierany i zapisywany do zmiennej.
```javascript
const data = fs.readFileSync('artykul.html', 'utf8')
```
2. artykuł i komenda są przekazywane do OpenAI.
```javascript
const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { 
            role: "system", 
            content: "..."},
        {
            role: "user",
            content: data,
        },
    ],
})
```
3. OpenAI odsyła odpowiedź.
4. odpowiedź jest zapisywana w pliku `podglad.html`.
```javascript
fs.writeFileSync("podglad.html", res)
```
5. za pomocą regex, sekcja body jest czyszczona.
6. szablon jest zapisywany w pliku `szablon.html`.
```javascript
const regex = /(<body>)[\s\S]+(<\/body>)/g;
fs.writeFileSync("szablon.html", res.replace(regex, "<body>\n</body>"))
```
- `photos.js`
1. plik `podglad.html` z artykułem jest otwierany i zapisywany do zmiennej.
```javascript
const data = fs.readFileSync('podglad.html', 'utf8')
```
2. opisy zdjęć są wyodrębniane z artykułu za pomocą regex.
```javascript
const imgRegex = /\<img src\=\'[\w.]+\' alt=\'[\w\s.ąĄćĆeĘłŁóÓśŚżŻźŹ]+\' \/\>/g
const imgs = data.match(imgRegex)

const altRegex1 = /\<img src\=\'[\w.]+\' alt=\'/g
const altRegex2 = /\' \/\>/g

var alts = []

imgs.forEach((img) => {
    alts.push(img.replace(altRegex1, "").replace(altRegex2, ""))
})
```
3. wszystkie opisy zdjęć są wysyłane do OpenAI (asynchronicznie).
```javascript
await generateAllIMGs(alts)
```
```javascript
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
```
4. po otrzymaniu odpowiedzi od OpenAI z linkiem, obrazy są pobierane.
```javascript
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
```
5. za pomocą regex obrazy są zastępowane na stronie.
```javascript
const imgRepRegex = /<img src=\'[a-zA-Z_.]+\'/

var res = data

for (var index = 1; index <= alts.length; index++) {
    res = res.replace(imgRepRegex, "<img src='image_placeholder"+index+".jpg'")
}
```
6. gotowa strona jest zapisywana do pliku `podglad_zdjecia.html`.
```javascript
fs.writeFileSync("podglad_zdjecia.html", res)
```
[EN]
# HOW TO RUN IT

1. Install dependencies.
`npm install`

2. Edit .env file.
`OPENAIAPI_KEY="YOUR OPEN AI API KEY"`

3. Run application.
For article: `node --env-file=.env index.js`

For full side and template: `node --env-file=.env fullside.js`

For photos to full side `node --env-file=.env photos.js`

# HOW IT WORK
- `index.js`
1. a .txt file with the text of the article is opened and is saved to a variable.
```javascript
const data = fs.readFileSync('Zadanie dla JJunior AI Developera - tresc artykulu.txt', 'utf8');
```
2. the text and command is passed to OpenAI.
```javascript
const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})
const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { 
            role: "system", 
            content: "..."},
        {
            role: "user",
            content: data,
        },
    ],
});
```
3. OpenAI sends back the response.
4. the response is written to the file `artykul.html`.
```javascript
fs.writeFileSync("artykul.html", completion.choices[0].message.content);
```
- `fullside.js`
1. the `artykul.html` file with the article is opened and saved to a variable.
```javascript
const data = fs.readFileSync('artykul.html', 'utf8')
```
2. the article and the command are passed to OpenAI.
```javascript
const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { 
            role: "system", 
            content: "..."},
        {
            role: "user",
            content: data,
        },
    ],
})
```
3. OpenAI sends back the response.
4. the response is saved in the `podglad.html` file.
```javascript
fs.writeFileSync("podglad.html", res)
```
5. using regex, the body section is cleaned up.
6. the template is saved in the `szablon.html` file.
```javascript
const regex = /(<body>)[\s\S]+(<\/body>)/g;
fs.writeFileSync("szablon.html", res.replace(regex, "<body>\n</body>"))
```
- `photos.js`
1. the `podglad.html` file with the article is opened and saved to a variable.
```javascript
const data = fs.readFileSync('podglad.html', 'utf8')
```
2. photo descriptions are extracted from the article using regex.
```javascript
const imgRegex = /\<img src\=\'[\w.]+\' alt=\'[\w\s.ąĄćĆeĘłŁóÓśŚżŻźŹ]+\' \/\>/g
const imgs = data.match(imgRegex)

const altRegex1 = /\<img src\=\'[\w.]+\' alt=\'/g
const altRegex2 = /\' \/\>/g

var alts = []

imgs.forEach((img) => {
    alts.push(img.replace(altRegex1, "").replace(altRegex2, ""))
})
```
3. all photo descriptions are sent to OpenAI (asynchronously).
```javascript
await generateAllIMGs(alts)
```
```javascript
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
```
4. after receiving a response from OpenAI with a link, the images are downloaded.
```javascript
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
```
5. using regex, the images are replaced on the page.
```javascript
const imgRepRegex = /<img src=\'[a-zA-Z_.]+\'/

var res = data

for (var index = 1; index <= alts.length; index++) {
    res = res.replace(imgRepRegex, "<img src='image_placeholder"+index+".jpg'")
}
```
6. the finished page is saved to a `podglad_zdjecia.html` file.
```javascript
fs.writeFileSync("podglad_zdjecia.html", res)
```

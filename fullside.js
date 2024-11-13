import fs from "node:fs"
import OpenAI from "openai"

try {
    var startDT = new Date()

    console.log("OPENAI TASK START: "+startDT)

    const data = fs.readFileSync('artykul.html', 'utf8')
    const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY})

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system", 
                content: "Wygeneryj stronę www w standardzie html5 dla podanej treści. W tagach <body></body> dodaj podaną teść. Nie zmieniaj podanej treści. Dodaj tagi <style> </style> i zmień wygląd strony. Dodaj tagi <script> </script> poza tagami <body> </body> i umieść w nich jakiś skrypt dodający funkcjonalność na stronie. Tagi <style> </style oraz <script> </script> muszą być poza tagami <body> </body>. Tagi <script> </script> dodaj po tagu </body>. Pomiń ```html ```"},
            {
                role: "user",
                content: data,
            },
        ],
    })

    const res = completion.choices[0].message.content

    console.log(res)

    var stopDT = new Date()
    var aiDT = (stopDT-startDT) / 1000

    console.log("OPENAI TASK FINISH: "+stopDT)
    console.log("Open AI took "+aiDT+"s to respond to the command.")

    try {
        fs.writeFileSync("podglad.html", res)
        console.log("Answer saved to the file 'podglad.html'")

        const regex = /(<body>)[\s\S]+(<\/body>)/g;
        fs.writeFileSync("szablon.html", res.replace(regex, "<body>\n</body>"))
        console.log("Template saved to the file 'szablon.html'")
        
    } catch (err) {
        console.error(err);
    }

  } catch (err) {
    console.error(err);
  }
import fs from "node:fs"
import OpenAI from "openai";

try {
    var startDT = new Date()

    console.log("OPENAI TASK START: "+startDT)

    const data = fs.readFileSync('Zadanie dla JJunior AI Developera - tresc artykulu.txt', 'utf8');
    const openai = new OpenAI({apiKey: process.env.OPENAIAPI_KEY});

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system", 
                content: "Stwórz strone www z podaną teścią. Ogranicz się do samej cześci między tagami <body></body>. Pomijejąc same tagi <body></body>. Nie wstawiaj tagów head, html, body. Wstaw do tekstu trzy grafiki w kluczowych miejscach tekstu. Użyj tagów <img> src='image_placeholder.jpg'</img> do wstawienia grafik. Do tagów img dodaj atrybut alt opisujący dane zdjęcia. Dodaj podspi pod wstawionymi grafikami."},
            {
                role: "user",
                content: data,
            },
        ],
    });

    console.log(completion.choices[0].message.content);

    var stopDT = new Date()
    var aiDT = (stopDT-startDT) / 1000

    console.log("OPENAI TASK FINISH: "+stopDT)
    console.log("Open AI took "+aiDT+"s to respond to the command.")

    try {
        fs.writeFileSync("artykul.html", completion.choices[0].message.content);
        console.log("Answer saved to the file 'artykul.html'")
        
    } catch (err) {
        console.error(err);
    }

  } catch (err) {
    console.error(err);
  }
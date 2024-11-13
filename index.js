import fs from "node:fs"
import OpenAI from "openai";

try {
    var startDT = new Date()

    console.log("Kiedy Open AI otrzymało polecenie: "+startDT)

    const data = fs.readFileSync('Zadanie dla JJunior AI Developera - tresc artykulu.txt', 'utf8');
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY1});

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system", 
                content: "Stwórz strone www z podaną teścią. Ogranicz się do samej cześci między tagami <body></body>, pomijejąc same tagi <body></body>" },
            {
                role: "user",
                content: data,
            },
        ],
    });

    console.log(completion.choices[0].message.content);

    var stopDT = new Date()
    var aiDT = (stopDT-startDT) / 1000

    console.log("Kiedy Open AI wysłało odpowiedź: "+stopDT)
    console.log("OpenAI potrzebowało "+aiDT+"s by to przetworzyć.")

    //var outFileName = "article_"+stopDT.getFullYear()+"-"+(stopDT.getMonth()+1)+"-"+stopDT.getDate()+"_"+stopDT.getHours()+"-"+stopDT.getMinutes()+"-"+stopDT.getSeconds()+".txt"

  } catch (err) {
    console.error(err);
  }
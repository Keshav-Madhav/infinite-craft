import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser:true});

const CreateNewElement = async({element1, element2}: {element1: string, element2: string}) => {
  console.log(process.env.NEXT_OPENAI_API_KEY)
  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: `Your task is to combine two input elements into a resulting element that closely relates to both. 
        Input:
        El1= element1
        El2= element2

        Response:
        <Emoji>:resulting element

        Return #NAN# if no suitable result is found. Use the emoji "❓" for rare cases where no suitable emoji is found.

        Example:
        El1= "Fire"
        El2= "Water"
        Response= 💨:Steam

        The input is:
        El1: ${element1}
        El2: ${element2}

        Please reply in the format <Emoji>:resulting element`
    }],
    model: "gpt-4o",
    temperature: 0.1,
    
  });

  console.log(completion.choices[0]);
  console.log(completion.choices[0].message.content?.replace(':', " "));
  return completion.choices[0].message.content;
}

export default CreateNewElement
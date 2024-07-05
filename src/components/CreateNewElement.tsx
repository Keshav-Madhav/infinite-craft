import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser:true});

const CreateNewElement = async({element1, element2}: {element1: string, element2: string}) => {
  console.log(process.env.NEXT_OPENAI_API_KEY)
  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: `Your task is to combine two input elements into a resulting element that closely relates to both. 
        The resulting element should be connected to both input elements in some way. 
        The resulting element cannot be disjoint from one or both the inputs. 
        The resulting element is a superset of the input elements meaning if two of the same thing are combined, the result is the plural of that thing. Example: Water+Water=Lake,Fire+fire=Wildfire,lake+lake=seas,tree+tree=forest,dust+dust=desert, etc.
        Above rule applies only if there is a an result for multiple of the input elements, Example: Earth+Earth=Mountain,Sun+Sun=Star,Electricity+Electricity=Lightning, etc.
        Input:
        El1= element1
        El2= element2
        Response:
        <Emoji>:resulting element

        Return #NAN# if no suitable result is found. Use the emoji "❓" for rare cases where no suitable emoji is found.
        Use the most relevant emoji for the resulting element instead of joining emojis of input elements.
        Remember, no word is outrageous and all combinations are possible.
        Always try to create a new unique but real element.
        Example:
        El1=Fire
        El2=Water
        Response= 💨:Steam
        El1:Fire
        El2:Earth
        Response=🌋:Lava
        El1:Earth
        El2:Water
        Response=🌱:Plant
        El1:Water
        El2:Wind
        Response=🌊:Wave
        El1:Earth
        El2:Wind
        Response=🌫️:Dust
        El1:Earth
        El2:Dust
        Response=🪐:Planet

        The input is:
        El1: ${element1}
        El2: ${element2}
        Please reply in the format <Emoji>:resulting element`
    }],
    model: "gpt-4o",
    temperature: 0.1,
  });

  return completion.choices[0].message.content || '#NAN#';
}

export default CreateNewElement
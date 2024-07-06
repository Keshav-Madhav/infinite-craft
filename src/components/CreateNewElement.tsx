import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser:true});

const CreateNewElement = async({element1, element2}: {element1: string, element2: string}) => {
  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: `Your task is to combine two input elements into a resulting element that closely relates to both. (from here on now, elements are used to describe anything, it can be a physical element, a concept, a feeling, an entity, etc.)
        The resulting element 1) should be connected to both input elements closely, 2) cannot be disjoint from one or both the inputs and 3) should be a superset of the input elements meaning if two of the same thing are combined, the result is the collective of that thing. Example: Water+Water=Lake,Fire+fire=Wildfire,lake+lake=seas,tree+tree=forest,dust+dust=desert, etc.
        Rule 3 does not apply if there is a no collective of the input elements, Example: Earth+Earth=Mountain,Sun+Sun=Star,Electricity+Electricity=Lightning, etc.
        Input:
        El1= element1
        El2= element2
        Response:
        <Emoji>:resulting element

        Return #NAN# in rare instances if no suitable result is found. 
        Use the emoji "❓" for rare cases where no suitable emoji is found but always and only return emoji.
        Use the most relevant emoji for the resulting element instead of giving emojis of input elements.
        Remember, no word is outrageous and all combinations are possible.
        Always try to create a new unique but real element.
        Example:
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
        El1:Earth
        El2:Plant
        Response=🧬:Life

        The input is:
        El1: ${element1}
        El2: ${element2}
        Please only reply in the format <Emoji>:resulting element`
    }],
    model: "gpt-4o",
    temperature: 0,
  });

  return completion.choices[0].message.content || '#NAN#';
}

export default CreateNewElement
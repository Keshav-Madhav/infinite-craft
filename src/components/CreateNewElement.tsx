import { OpenAI } from "@langchain/openai";

const model = new OpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const CreateNewElement = async({element1, element2}: {element1: string, element2: string}) => {
  const response = await model.invoke(
    `Your task is to combine two input elements into a resulting element that closely relates to both. (from here on now, elements are used to describe anything, it can be a physical element, a concept, a feeling, an entity, etc.)
    The resulting element 1) should be connected to both input elements closely, 2) cannot be disjoint from one or both the inputs.
    Input:
    El1= element1
    El2= element2
    Response:
    <Emoji>:resulting element

    Return #NAN# in rare instances if no suitable result is found. 
    Use the emoji "❓" for rare cases where no suitable emoji is found but always and only return emoji.
    Use the most relevant emoji for the resulting element.
    Following combinations are fixed:
    Earth+Water=🌱:Plant
    Water+Water=🌊:Lake
    Earth+Earth=🌄:Mountain
    Earth+Fire=🌋:Volcano
    Fire+Fire=🔥:Wildfire
    Fire+Water=🌫️:Steam
    Water+Wind=🌪️:Tornado
    Water+Plant=🌿:Algae
    Earth+Plant=🧬:Life
    Earth+Wind=🌍:Atmosphere
    Earth+Tornado=🌫️:Dust
    Earth+Dust=🪐:Planet

    Other combinations are allowed.

    The input is:
    El1: ${element1}
    El2: ${element2}
    Please only reply in the format <Emoji>:resulting element`
  );

  return response || '#NAN#';
}

export default CreateNewElement
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function processWithAI(items: any[]) {





  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: `you are an AI assistant that summarizes GitHub repositories.you will get an array of objects that contain repos data extract all the data and return in a json format,the list is as follows:${JSON.stringify(items, null, 2)}
return a json without any additional text or explanation, if the user name is repeated collect the user infor as an object ans then the projects as an array of objects, if the user name is not repeated return the user info as an object and the projects as an array of objects.
        `,
      },
    ],
  })

  if (!response.choices || response.choices.length === 0) {
    throw new Error('AI processing failed')
  }



  return response.choices[0].message?.content ?? 'No summary available'
}
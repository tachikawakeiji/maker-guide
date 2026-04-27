export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

const { item, category, level } = req.body;
const apiKey = process.env.GROQ_API_KEY;

const prompt = 'You are a DIY expert. Return ONLY valid JSON for how to make: ' + item + '. Category: ' + (category || 'General') + '. Level: ' + (level || 'Beginner') + '. Use this exact format: {"title":"name","emoji":"emoji","summary":"2 sentences","difficulty":"Easy or Medium or Hard","totalTime":"time","totalCost":"cost in USD","materials":[{"name":"name","amount":"amount","cost":"cost","where":"store"}],"tools":["tool1","tool2"],"steps":[{"title":"title","detail":"detail","tip":"tip or empty string"}],"warnings":["warning"],"sellTip":"how to sell for profit"}';

try {
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + apiKey
},
body: JSON.stringify({
model: 'llama3-8b-8192',
messages: [{ role: 'user', content: prompt }],
temperature: 0.7
})
});

const data = await response.json();
const content = data.choices[0].message.content;
const jsonMatch = content.match(/\{[\s\S]*\}/);
const result = JSON.parse(jsonMatch[0]);
res.status(200).json(result);
} catch (error) {
res.status(500).json({ error: 'Failed to analyze' });
}
}
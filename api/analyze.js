export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

const { item, category, level } = req.body;
const apiKey = process.env.OPENROUTER_API_KEY;

const prompt = 'You are a DIY expert. Return ONLY valid JSON for how to make: ' + item + '. Category: ' + (category || 'General') + '. Level: ' + (level || 'Beginner') + '. Use this exact format: {"title":"name","emoji":"emoji","summary":"2 sentences","difficulty":"Easy or Medium or Hard","totalTime":"time","totalCost":"cost in USD","materials":[{"name":"name","amount":"amount","cost":"cost","where":"store"}],"tools":["tool1","tool2"],"steps":[{"title":"title","detail":"detail","tip":"tip or empty string"}],"warnings":["warning"],"sellTip":"how to sell for profit"}';

try {
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + apiKey,
'HTTP-Referer': 'https://maker-guide.vercel.app',
'X-Title': 'AI Maker Guide'
},
body: JSON.stringify({
model: 'google/gemini-2.0-flash-exp:free',
messages: [{ role: 'user', content: prompt }],
response_format: { type: 'json_object' }
})
});

const data = await response.json();
const result = JSON.parse(data.choices[0].message.content);
res.status(200).json(result);
} catch (error) {
res.status(500).json({ error: 'Failed to analyze' });
}
}

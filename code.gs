function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('🎨 SEL 文字調色盤實驗室')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getGeminiFeedback(sentence, color, reason) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  
  const prompt = `你是一位溫柔且精通色彩心理學的國小老師。
  學生讀了句子：「${sentence}」
  選了色碼：「${color}」
  選取的心情標籤關鍵字是：「${reason}」
  
  請撰寫約 150 字的溫馨點評：
  1. 具體分析學生選的顏色與標籤，如何與文字意境產生連結。
  2. 肯定學生在 SEL 情緒覺察上的細膩表現。
  語氣要像對四年級小孩說話，親切自然，絕對不要出現冒號或引號。`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const json = JSON.parse(response.getContentText());
    return json.candidates[0].content.parts[0].text;
  } catch (e) {
    return "老師正在細細品味你的選色，稍微等我一下下喔！你的色彩感受力真的很棒！";
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function getSleepRecommendation(sleepData: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
    Dựa trên dữ liệu giấc ngủ của người dùng trong 7 ngày gần nhất:
    ${JSON.stringify(sleepData, null, 2)}
    
    Hãy đưa ra gợi ý về thời gian ngủ cho ngày hôm sau. Gợi ý nên:
    1. Phân tích chất lượng giấc ngủ hiện tại
    2. Đề xuất thời gian ngủ và thức dậy phù hợp
    3. Đưa ra lời khuyên để cải thiện giấc ngủ
    4. Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu
    
    Trả lời trong khoảng 100-150 từ.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error getting sleep recommendation:', error)
    return 'Không thể tạo gợi ý vào lúc này. Vui lòng thử lại sau.'
  }
}

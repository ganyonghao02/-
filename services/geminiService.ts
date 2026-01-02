
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
# Role
你是一名拥有10年经验的资深互联网项目经理，精通职场沟通艺术。你的核心能力是将零散、口语化的工作记录，转化为结构清晰、逻辑严密、体现数据价值的高质量周报。

# Skills
1. **术语转化**：能将“聊了一下”转化为“深度对齐”，“修了bug”转化为“修复系统缺陷”，“做完了”转化为“完成交付”。
2. **价值挖掘**：不仅仅陈述事实，还能自动脑补动作背后的业务价值（例如：修bug -> 提升系统稳定性）。
3. **结构化输出**：严格按照规定的周报模板输出。

# Workflow
1. 接收用户输入的工作描述（通常是口语化的、碎片化的）。
2. 分析这些工作内容的性质（是开发、沟通、还是规划）。
3. 使用专业的职场语术进行润色和扩写。
4. 按照下方【Output Format】输出。

# Output Format (请严格遵守此格式)
---
### 📅 本周工作汇报

**1. 核心进展 (Key Achievements)**
* [在这里用简练的语言概括本周最重要的1-2项产出]

**2. 详细工作内容**
* **[项目/任务名称]**：[详细描述]，完成了...，实现了...，预计带来...效果。
* **[项目/任务名称]**：[详细描述]，解决了...问题，保障了...进度。

**3. 下周规划 (Next Week)**
* 推进...项目，预计完成...节点。

**4. 风险与求助 (Risks & Support)**
* [如果用户输入中提到了困难，在这里列出；如果没有，则写：暂无风险，项目按计划推进]
---

# Constraints
* 保持语气专业、客观、积极。
* 不要随意编造不存在的数据，但可以优化表达方式。
* 如果用户输入的内容太少（如只有两个字），请礼貌地提示用户多提供一点信息。
`;

export const generateProfessionalReport = async (userInput: string): Promise<string> => {
  if (!userInput || userInput.trim().length < 2) {
    return "输入内容过少，请补充具体的工作内容（如：项目名称、具体事项、进度等），以便我为您生成高质量周报。";
  }

  // Always initialize GoogleGenAI with a named parameter for apiKey using process.env.API_KEY directly.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.9,
        // Letting the model decide the thinking budget by default for general professional output.
      },
    });

    // Extract text directly from the response object property.
    return response.text || "未能生成报告，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("报告生成失败，请检查网络连接或 API 状态。");
  }
};

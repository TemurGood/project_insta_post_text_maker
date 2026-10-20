'use server';

import Groq from 'groq-sdk';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { sql } from 'drizzle-orm';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 30000,
});

export async function generateSurrealPost(words: string, emotion: string) {
  try {
    const modelList = await groq.models.list();
    const availableIds = modelList.data.map((m) => m.id);

    const targetModel =
      availableIds.find(
        (id) =>
          (id.includes('qwen') || id.includes('llama') || id.includes('gpt')) &&
          !id.includes('whisper') &&
          !id.includes('guard')
      ) || availableIds[0];

    const prompt = `
      Ты — поэт-сюрреалист, абсурдист и контент-мейкер.
      Напиши короткий, завораживающий, сюрреалистичный пост для Instagram.
      
      Входные слова: "${words}"
      Эмоциональный фон: "${emotion}"
      
      ПРАВИЛА:
      1. Обязательно используй входные слова. Ты МОЖЕШЬ и ДОЛЖЕН склонять их, спрягать, менять число, род и падеж так, чтобы текст звучал связно, грамматически безупречно, но по смыслу сюрреалистично.
      2. Текст должен быть пропитан эмоцией: ${emotion}.
      3. Смешивай несмешиваемое, создавай визуальные парадоксы в духе Сальвадора Дали.
      4. Длина: 2-4 предложения. В конце добавь 3-4 сюрреалистичных хэштега на русском языке.
      
      Выдай ТОЛЬКО текст поста, без лишних пояснений.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: targetModel,
      temperature: 0.85,
    });

    const content = chatCompletion.choices[0]?.message?.content?.trim() || '';

    // Автоматически создаем таблицу posts, если ее еще нет в Turso
    try {
      await db.run(sql`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          words TEXT NOT NULL,
          emotion TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT NOT NULL
        )
      `);

      // Сохраняем результат
      await db.insert(posts).values({
        words,
        emotion,
        content,
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('DB notification:', dbErr);
    }

    // Возвращаем результат на экран в любом случае!
    return { success: true, content };
  } catch (error) {
    console.error('Error generating post:', error);
    return { success: false, error: 'Ошибка генерации текста.' };
  }
}
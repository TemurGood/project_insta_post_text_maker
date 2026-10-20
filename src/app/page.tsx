'use client';

import { useState } from 'react';
import { generateSurrealPost } from './actions';
import { Sparkles, Copy, Check, RotateCcw, PenLine } from 'lucide-react';

const EMOTIONS = [
  'Трепет',
  'Любовь',
  'Радость',
  'Грусть',
  'Гнев',
  'Безразличие',
  'Апатия',
  'Отвращение',
];

export default function Home() {
  const [words, setWords] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('Трепет');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!words.trim() || loading) return;

    setLoading(true);
    setResult('');

    const res = await generateSurrealPost(words, selectedEmotion);
    if (res.success && res.content) {
      setResult(res.content);
    } else {
      alert('Ошибка при генерации. Попробуйте еще раз.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ambient-glow min-h-screen flex flex-col justify-between py-10 px-4 sm:px-6">
      <div className="max-w-xl w-full mx-auto space-y-6">
        
        {/* Шапка */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            AI Пост-генератор
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Сюрреалистичный текст
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Генерирует необычные тексты для постов и рилс, склоняя слова
          </p>
        </div>

        {/* Главная карточка */}
        <div className="bg-[#12141c] border border-neutral-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Поле ввода */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <PenLine className="w-3.5 h-3.5 text-neutral-400" />
                Слова для сюжета
              </label>
              <input
                type="text"
                placeholder="например: собака, трава, луна"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                className="w-full bg-[#181a24] border border-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Выбор эмоции */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300 block">
                Эмоциональный окрас
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {EMOTIONS.map((emotion) => {
                  const isActive = selectedEmotion === emotion;
                  return (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => setSelectedEmotion(emotion)}
                      className={`text-xs py-2 px-2 rounded-lg font-medium transition-all text-center border ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-[#181a24] text-neutral-400 border-neutral-800/80 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      {emotion}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Кнопка запуска */}
            <button
              type="submit"
              disabled={loading || !words.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-600/10"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-neutral-400" />
                  <span>Сочиняем...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Создать пост</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Результат */}
        {result && (
          <div className="bg-[#12141c] border border-neutral-800/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-neutral-300">Готовый пост</span>
                <span className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md">
                  {selectedEmotion}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  title="Сгенерировать другой вариант"
                  className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
                    copied
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-neutral-800 bg-[#181a24] text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-neutral-200 text-sm leading-relaxed whitespace-pre-line font-serif italic">
              {result}
            </p>
          </div>
        )}

      </div>

      <footer className="text-center text-xs text-neutral-600 pt-8 font-mono">
        Instagram Surrealism • Next.js & Turso
      </footer>
    </div>
  );
}
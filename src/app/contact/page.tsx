"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">Contact</p>
        <h1 className="text-3xl md:text-4xl font-bold">お問い合わせ</h1>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-green-800 text-lg font-semibold mb-2">
            送信ありがとうございます。
          </p>
          <p className="text-green-600 text-sm">
            内容を確認のうえ、ご返信いたします。
          </p>
        </div>
      ) : (
        <div className="bg-white border border-border/60 rounded-2xl p-8 md:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="山田 太郎"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                お問い合わせ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="お気軽にお問い合わせください"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white font-semibold px-10 py-3.5 rounded-xl hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              送信する
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

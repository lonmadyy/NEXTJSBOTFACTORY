'use client'

import { useState } from 'react'
import { homeFaq } from '@/lib/site'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section className="relative z-10 bg-[#050505] px-4 py-24 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="font-syne text-4xl font-bold uppercase text-white md:text-6xl">
            Часто задаваемые вопросы
          </h2>
          <p className="mt-3 font-manrope text-neutral-500">
            Актуально для проектов в Минске и по всей Беларуси
          </p>
        </div>

        <div className="space-y-4">
          {homeFaq.map((item, index) => (
            <article
              key={item.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm"
            >
              <button
                type="button"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                onClick={() =>
                  setOpenIndex((prev) => (prev === index ? -1 : index))
                }
                className="flex w-full items-start text-left font-syne text-2xl font-bold text-white md:text-3xl"
              >
                <span
                  className={`mr-4 inline-block text-[#4F46E5] transition-transform duration-300 ease-out ${
                    openIndex === index ? 'rotate-45' : 'rotate-0'
                  }`}
                >
                  +
                </span>
                <span>{item.question}</span>
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
                  openIndex === index
                    ? '[grid-template-rows:1fr] opacity-100 mt-4'
                    : '[grid-template-rows:0fr] opacity-0 mt-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pl-8 font-manrope text-lg text-neutral-300">
                    {item.answer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


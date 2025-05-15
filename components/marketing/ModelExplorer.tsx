"use client"
import React, { useState } from "react";
import { cn } from "@/functions";

const CATEGORIES = [
  "All",
  "Chat",
  "Image",
  "Vision",
  "Audio",
  "Language",
  "Code",
  "Embeddings",
  "Rerank",
];

const MODELS = [
  {
    category: "Chat",
    name: "DEEPSEEK-R1",
    description: "Open-source reasoning model rivaling OpenAI-0, excelling in math, code...",
    icon: "🦈",
    new: false,
  },
  {
    category: "Chat",
    name: "QWEN3 23B A2B FP8 THROUGHPUT",
    description: "Hybrid instruct + reasoning model (23B/22B MoE) optimized for high...",
    icon: "🔯",
    new: true,
  },
  {
    category: "Chat",
    name: "GEMMA 3 27B",
    description: "Lightweight model with vision-language input, multilingual support...",
    icon: "🌐",
    new: false,
  },
  {
    category: "Chat",
    name: "QWEN QWQ-32B",
    description: "Qwen series reasoning model excelling in complex tasks...",
    icon: "🔯",
    new: false,
  },
  {
    category: "Chat",
    name: "LLAMA 4 MAVERICK",
    description: "SOTA 128-expert MoE powerhouse for complex reasoning, math, code...",
    icon: "🦙",
    new: false,
  },
  {
    category: "Chat",
    name: "LLAMA 4 SCOUT",
    description: "SOTA 109B MoE with 178B active parameters & large context, excelling at...",
    icon: "🦙",
    new: false,
  },
  {
    category: "Chat",
    name: "DEEPSEEK-V3-0324",
    description: "DeepSeek's latest open Mixture-of-Experts model challenging top AI...",
    icon: "🦈",
    new: false,
  },
  {
    category: "Chat",
    name: "DEEPSEEK R1 DISTILLED LLAMA 70B FREE",
    description: "Free endpoint to experiment the power of reasoning models. This...",
    icon: "🦈",
    new: false,
  },
];

export default function ModelExplorer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredModels =
    activeCategory === "All"
      ? MODELS
      : MODELS.filter((m) => m.category === activeCategory);

  return (
    <section className="w-full min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-2 md:px-0">
      {/* Heading */}
      <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4">
        <span className="text-primary">200+</span> generative AI models
      </h1>
      <p className="text-center text-lg max-w-2xl mb-8 text-muted-foreground">
        Build with open-source and specialized multimodal models for chat, images, code, and more. Migrate from closed models with OpenAI-compatible APIs.
      </p>
      {/* Category Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center justify-center mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={cn(
              "px-4 py-1 rounded-full border text-sm font-medium transition",
              activeCategory === cat
                ? "bg-accent text-accent-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-muted"
            )}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <button className="ml-4 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/80 transition hidden sm:block">
          Try now
        </button>
      </div>
      {/* Try now button for mobile */}
      <button className="mb-6 px-6 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/80 transition sm:hidden">
        Try now
      </button>
      {/* Model Grid */}
      <div className="w-full flex justify-center">
        <div className="bg-card border border-border rounded-xl shadow-lg p-4 w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredModels.map((model) => (
              <div
                key={model.name}
                className="relative flex flex-col border border-border rounded-lg bg-background p-4 min-h-[220px] shadow-sm hover:shadow-md transition"
              >
                {/* Category */}
                <span className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  {model.category}
                </span>
                {/* New badge */}
                {model.new && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                {/* Icon */}
                <div className="text-4xl mb-2">{model.icon}</div>
                {/* Name */}
                <div className="font-bold text-lg mb-1 text-foreground">
                  {model.name}
                </div>
                {/* Description */}
                <div className="text-sm text-muted-foreground mb-4 flex-1">
                  {model.description}
                </div>
                {/* Try this model button */}
                {/* <button className="mt-auto px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/80 transition">
                  TRY THIS MODEL →
                </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
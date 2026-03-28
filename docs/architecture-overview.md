# SecondOrder Architecture Overview

This document gives two shareable views of the current system:

- the product and system architecture
- the meta-thinking flow used for harder chat requests

## High-Level System

```mermaid
flowchart LR
    user["User"]
    marketing["Marketing Site<br/>`/`"]
    chatUi["Chat UI<br/>`/chat` and `/chat/[threadId]`"]
    chatApi["Chat API<br/>`app/api/chat/route.ts`"]
    workflow["Meta Chat Workflow<br/>classify -> plan -> draft -> critique"]
    agent["SecondOrder Agent<br/>final streamed response"]
    memory["Mastra Memory Store<br/>thread history + titles"]
    events["Chat Events Store<br/>feedback + analytics events"]
    models["LLM Models<br/>main agent + planner + critic"]
    storage["Storage Backend<br/>Postgres or LibSQL/local file"]

    user --> marketing
    user --> chatUi
    chatUi --> chatApi
    chatApi --> memory
    chatApi --> workflow
    workflow --> models
    workflow --> agent
    agent --> models
    agent --> memory
    chatApi --> events
    memory --> storage
    events --> storage
    chatApi --> chatUi
    chatUi --> user
```

### What this means

- The marketing site explains the product and sends people into the chat experience.
- The chat UI talks only to the Next.js chat API route.
- The API route is the orchestration boundary: it validates the request, loads thread history, runs the meta workflow, and streams the final answer back to the UI.
- Mastra provides the workflow engine, agent runtime, memory, and storage integration.
- Thread history and titles live in Mastra memory storage.
- Product analytics events like `thread_started`, `meta_mode_used`, and `feedback_submitted` are recorded separately for measurement.
- Storage can run on Postgres in production or LibSQL/file-backed storage locally.

## Meta-Thinking Process

```mermaid
flowchart TD
    request["User message arrives"]
    classify["1. Classify task<br/>simple chat, analysis, planning,<br/>decision, or troubleshooting"]
    gate{"Use meta mode?"}
    direct["Respond directly"]
    plan["2. Planner pass<br/>goal, constraints, plan,<br/>response strategy"]
    draft["3. Draft pass<br/>short draft answer"]
    critique["4. Critic pass<br/>confidence, limitations,<br/>context gaps, adjustments"]
    context["5. Build request context<br/>task type + meta guidance"]
    final["6. SecondOrder agent writes<br/>the final user-visible reply"]
    stream["7. Stream answer to UI<br/>with compact metadata"]
    feedback["8. Capture product events<br/>and user feedback"]

    request --> classify
    classify --> gate
    gate -- "No" --> direct
    direct --> final
    gate -- "Yes" --> plan
    plan --> draft
    draft --> critique
    critique --> context
    context --> final
    final --> stream
    stream --> feedback
```

### How to explain this to a friend

- SecondOrder does not always use a heavy workflow. It first decides whether the request is simple or whether it needs a more structured pass.
- For harder requests, it creates a compact plan before answering.
- It then critiques that draft so the final response can include better framing, clearer limitations, and missing-context signals.
- The user does not see the full hidden chain-of-thought. They get a normal answer plus compact, useful signals about how the system approached the task.
- That makes the product feel like a chat assistant with visible reasoning discipline, not just raw text generation.

## Current Building Blocks

- UI: [`app/page.tsx`](/Users/henry/workspace/secondorder-web/app/page.tsx), [`app/chat/page.tsx`](/Users/henry/workspace/secondorder-web/app/chat/page.tsx), [`app/chat/[threadId]/page.tsx`](/Users/henry/workspace/secondorder-web/app/chat/[threadId]/page.tsx)
- API: [`app/api/chat/route.ts`](/Users/henry/workspace/secondorder-web/app/api/chat/route.ts)
- Workflow: [`mastra/workflows/meta-chat-workflow.ts`](/Users/henry/workspace/secondorder-web/mastra/workflows/meta-chat-workflow.ts)
- Agents and memory: [`mastra/agents.ts`](/Users/henry/workspace/secondorder-web/mastra/agents.ts)
- Runtime wiring: [`mastra/index.ts`](/Users/henry/workspace/secondorder-web/mastra/index.ts)
- Storage and events: [`lib/chat/history.ts`](/Users/henry/workspace/secondorder-web/lib/chat/history.ts), [`lib/chat/events.ts`](/Users/henry/workspace/secondorder-web/lib/chat/events.ts), [`lib/chat/storage.ts`](/Users/henry/workspace/secondorder-web/lib/chat/storage.ts)

# D3.js v7 + Strict TypeScript Development Rules

You are an expert software engineer specializing in modern D3.js (v7) and strict, type-safe TypeScript environments. Always adhere to the architectural constraints, semantic patterns, and typing strategies defined below.

---

## 1. Core Framework Constraints
* **D3 Version:** Always target **D3.js v7** syntax.
* **BANNED Syntax (Deprecated in v4-v6):**
  * NEVER use `d3.scale.linear()`. Use `d3.scaleLinear()`.
  * NEVER use `d3.layout.*` (e.g., `d3.layout.histogram`). Use the modern flat namespaces (e.g., `d3.bin()`).
  * NEVER use `d3.nest()`. Always use `d3.group()` or `d3.rollup()` from `d3-array`.
  * NEVER use `d3.event`. Use the explicit `event` object passed directly to the event listener callback: `(event, d) => { ... }`.
* **Selection Lifecycle:** Always prefer the declarative `.join()` paradigm over the legacy `.enter().append()` / `.exit().remove()` patterns.

---

## 2. Strict D3 TypeScript Typing Strategy

D3 selections require highly explicit type arguments. Do not allow implicit `any` fallback typing.

### Selection Signature Blueprint
Every D3 selection must satisfy the four-type parameter requirement when assigning to variables or structuring components:
```typescript
d3.Selection<GElement, Datum, PDatum PElement,>

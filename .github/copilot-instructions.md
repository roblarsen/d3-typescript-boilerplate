# D3.js v7 + Strict TypeScript Development Rules

You are an expert software engineer specializing in modern D3.js (v7) and strict, type-safe TypeScript environments. Always adhere to the architectural constraints, semantic patterns, and typing strategies defined below.

---

## 1. Core Framework Constraints

* **D3 Version:** Always target **D3.js v7** syntax.
* **BANNED Syntax (Deprecated in v4-v6):**
  * NEVER use `d3.scale.linear()`. Use `d3.scaleLinear()`.
  * NEVER use `d3.layout.*` (e.g., `d3.layout.histogram`). Use flat namespaces like `d3.bin()`.
  * NEVER use `d3.nest()`. Always use `d3.group()` or `d3.rollup()` from the `d3-array` module.
  * NEVER use `d3.event`. Use the explicit `event` object passed directly to the event listener callback: `(event, d) => { ... }`.
* **Selection Lifecycle:** Always prefer the declarative `.join()` paradigm over legacy `.enter().append()` / `.exit().remove()` patterns.

---

## 2. Strict D3 TypeScript Typing Strategy

D3 selections require explicit type arguments. Do not allow implicit `any` fallback typing.

### Selection Signature Blueprint
Every D3 selection variable or component target must satisfy the four-type parameter requirement listed below in order:
1. **GElement**: The current DOM element type being selected (e.g., `SVGSVGElement`, `SVGGElement`, `SVGPathElement`).
2. **Datum**: The type of the bound data item (e.g., `MyDataInterface`). Use `unknown` if unassigned, never bare `any`.
3. **PElement**: The parent DOM element type (typically `HTMLElement` or `SVGSVGElement`).
4. **PDatum**: The type of the parent data item (often `unknown` or `null`).

### Reference Implementation Checklist

* **SVG Initialization:**
  ```typescript
  const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> = d3
    .select(containerRef)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  ```

* **Data Binding & Join Lifecycle:**
  ```typescript
  interface MetricDatum {
    timestamp: Date;
    value: number;
  }

  const bars = svg.selectAll<SVGRectElement, MetricDatum>('rect.bar')
    .data(data, (d) => d.timestamp.toISOString()) // Always provide an explicit key function
    .join('rect')
    .attr('class', 'bar');
  ```

---

## 3. Event Handling Syntax

Event listener callbacks must always be specified with two arguments. The native or modified event is ALWAYS first; the bound datum is ALWAYS second.

```typescript
// Correct Signature
bars.on('mouseover', (event: MouseEvent, d: MetricDatum) => {
  const [pointerX, pointerY] = d3.pointer(event);
  // Implementation...
});
```

* **Rule:** Never attempt to read `this` inside an arrow function event listener for context. If the DOM node context is needed, use a standard function expression and type `this` explicitly:
  ```typescript
  bars.on('click', function(this: SVGRectElement, event: MouseEvent, d: MetricDatum) {
    d3.select(this).attr('fill', 'red');
  });
  ```

---

## 4. Scales and Axis Type Management

Scales must be bound explicitly to their domain and visual range types to ensure outputs pass directly into attributes without type-casting assertions.

```typescript
// Continuous Scales
const xScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
  .domain([0, 100])
  .range([margin.left, width - margin.right]);

// Categorical Scales
const yScale: d3.ScaleBand<string> = d3.scaleBand()
  .domain(data.map(d => d.id))
  .range([margin.top, height - margin.bottom])
  .padding(0.1);
```

When passing scales to axis generators, ensure the target selection types line up perfectly:
```typescript
const xAxis = d3.axisBottom(xScale);

svg.append('g')
  .attr('transform', `translate(0, ${height - margin.bottom})`)
  .call(xAxis);
```

---

## 5. Performance and Clean Code Preferences

* **Chaining Context:** Keep chains legible. Align dots vertically. Break long chain sequences into separate variable assignments if the target group context or nested element hierarchy changes.
* **Encapsulation:** Build charts as modular functions or clean classes that accept a container DOM element, data payload, and an configuration options object. Avoid writing global styling or layout side effects.
* **Memory Management:** Ensure any resize, re-render, or update cycles cleanly clear older timers, intervals, tooltips, or transition schedules before rebinding new elements.

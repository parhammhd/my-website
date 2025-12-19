---
title: "The Joy and Friction of Building with SvelteKit"
description: "An honest account of building a web app with SvelteKit, focusing on developer experience, architectural trade-offs, and real-world friction."
date: 2025-12-19
tags: [svelte, sveltekit, web-development, experience]
---

## Choosing the Right Amount of Abstraction

I wanted something as close to the platform as possible—but not so close that I’d spend weeks rebuilding infrastructure. Building with a minimal stack and web-native technologies has always appealed to me, which is why I initially considered Web Components for a new client project.

Web Components promised long-term stability and tight alignment with the platform, but they also meant assembling an application framework piece by piece—routing, data loading, state, and conventions included.

The problem was not whether Web Components could handle this kind of application, but whether they were the right tool under real delivery constraints. The app was not a collection of static pages or isolated widgets—it required authenticated flows, persistent user state, conditional navigation, and forms that carried business rules across multiple steps.

At that point, the cost of staying “close to the platform” became clearer. Every missing convention would have to be designed, implemented, and maintained: how data is loaded, where authorization checks live, how errors propagate, and how client and server concerns are separated. None of these are unsolved problems—but solving them again inside a client project felt like an unnecessary risk.

What I was really looking for was a framework that stayed close to web fundamentals while still offering a coherent application model—something lightweight, explicit, and predictable, without being content-first or overly opinionated. That is where Svelte, and eventually SvelteKit, started to make sense.

### Why Svelte?

What ultimately drew me to Svelte was not performance claims or bundle size charts, but how little it asked me to unlearn. Components felt like a thin layer over familiar web primitives rather than an entirely new programming model. HTML looked like HTML, CSS stayed local by default, and JavaScript behaved largely as expected.

Svelte’s approach to reactivity was a big part of that. State changes were explicit and readable, driven by assignment rather than lifecycle hooks or indirection. Instead of coordinating effects, dependencies, and render phases, I could focus on how data flowed through the component. The result was code that was easier to follow—not just to write, but to come back to later.

```js
<script>
  let count = 0;
  $: doubled = count * 2; // reactive assignment
</script>

<button on:click={() => count++}>
  Increment
</button>

<p>{count} doubled is {doubled}</p>
```

Compared to more mature SPA frameworks, Svelte felt intentionally constrained. There were fewer concepts to internalize, fewer patterns to choose between, and fewer “correct” ways to do the same thing. That constraint turned out to be a feature. It reduced decision fatigue and made the application easier to reason about as it grew.

Most importantly, the framework stayed out of the way. When something went wrong, I was usually debugging my own logic, not the interaction between multiple abstraction layers. That sense of directness made Svelte feel like a good middle ground: more structured than Web Components, but without the cognitive overhead that often comes with larger SPA ecosystems.

### Why SvelteKit?

Svelte addressed the problem of writing components that were easy to understand and reason about, but it did not, on its own, define how the application should be structured. Routing, data loading, authentication boundaries, and server-side logic still needed a coherent place to live. At that point, the question was not which UI framework to use, but which application model made sense.

Astro was a serious consideration. Its focus on minimal JavaScript and clear separation between content and interactivity aligned well with my preference for lightweight, web-first approaches. For content-driven sites, it is an excellent fit. However, this project was fundamentally application-oriented. It relied on authenticated user flows, dynamic state, and conditional behavior across multiple routes—concerns that sit at the core of an app rather than the edges of a content site.

SvelteKit offered a more natural model for that shape of problem. Its file-based routing and layouts provided structure without feeling heavy-handed, and its conventions were easy to follow without being overly prescriptive. Instead of assembling an application framework on top of Svelte, I could rely on one that already understood how pages, data, and server logic were meant to work together.

The explicit separation between client and server code further reinforced that clarity. With distinct files for server-side logic, execution contexts were obvious rather than implied. This reduced accidental complexity and made it easier to reason about where sensitive logic belonged as the application grew.

```ts
// +page.server.ts
export const load = async ({ params }) => {
  const user = await getUser(params.id);
  return { user };
};
```

At the same time, SvelteKit did not abandon web fundamentals. Data loading followed a request–response model, forms could work without JavaScript, and progressive enhancement was the default rather than an afterthought. That balance—application structure without drifting too far from the platform—is ultimately what made SvelteKit the right choice for this project.

That said, the framework was not frictionless. Understanding its lifecycle, data flow through layouts, and the boundaries between server and client took time. SvelteKit remained simple, but it was not shallow, and some of its abstractions only revealed their value after a few wrong turns.

### Where SvelteKit Pushed Back

#### Nested Layouts

The same structure that made SvelteKit approachable early on became a source of friction as the codebase grew. File-based routing and layouts are easy to understand in isolation, but in a larger project they can be surprisingly hard to reason about globally. When multiple `+layout.svelte` and `+page.svelte` files are involved, spread across nested routes, it is not always obvious which layout is wrapping which page without actively tracing the directory tree.

```text
src/routes/
├─ +layout.svelte
├─ dashboard/
│  ├─ +layout.svelte
│  └─ +page.svelte
└─ profile/
   └─ +page.svelte
```

This was especially noticeable when revisiting parts of the code after some time away. Understanding the full render path of a page—what data was loaded where, which layout introduced which UI or logic—sometimes required jumping between files and directories more than expected. The conventions were clear, but the mental overhead increased with depth.

#### Data Loading Decisions

Data loading introduced a different kind of complexity. While SvelteKit’s `load` functions provide a clean abstraction[^1], deciding *where* data should be loaded—at the page level, layout level, or server-only—was not always obvious upfront. Small placement decisions had a tendency to ripple outward, especially when shared data or authentication state was involved.

#### Client–Server Boundaries

The client–server boundary, while explicit, also required discipline. Moving logic between `+page.ts` and `+page.server.ts` could have subtle effects on performance and behavior, and mistakes were not always immediately visible. The framework made these boundaries clear, but it still demanded that you think carefully about them.

#### Framework Youth

Finally, some friction came from the framework’s relative youth. Compared to more mature SPA ecosystems, certain patterns, integrations, or edge cases required more digging through documentation or source code than expected. Solutions existed, but they were not always obvious or standardized.

None of these issues were blockers, but they were reminders that simplicity at the surface does not eliminate complexity—it redistributes it. SvelteKit reduced boilerplate and guesswork, but it still required an investment in understanding its mental model as the application evolved.

### Why I’d Still Choose SvelteKit

Despite the friction, SvelteKit remains the framework I would reach for again in similar projects. Its simplicity at the component level, combined with a coherent application model, struck the right balance between control and guidance. For an application that needed authenticated flows, persistent state, and predictable client-server behavior, it reduced cognitive overhead without hiding important decisions behind layers of abstraction.

The difficulties—navigating nested `+layout.svelte` and `+page.svelte` files, choosing the right place for data loading, managing client-server boundaries—were real, but manageable. They were trade-offs rather than blockers. In fact, confronting these challenges early made the architecture more explicit and maintainable in the long run.

SvelteKit is particularly suited for projects where clarity, directness, and predictable mental models matter more than an abundance of ready-made features. It may not be the fastest path for every type of project, but for applications that demand structure without unnecessary complexity, it is hard to beat.

Ultimately, the experience reinforced a principle that guided the entire project: choosing the right amount of abstraction matters more than the raw power of a framework. SvelteKit provided just enough abstraction to ship confidently, while keeping the code understandable and the mental model aligned with the platform.

[^1]: See the official SvelteKit load functions guide: [https://kit.svelte.dev/docs/load](https://kit.svelte.dev/docs/load){target="_blank" rel="noopener"}

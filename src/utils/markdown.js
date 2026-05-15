import { Fragment, createElement } from "react";

function tokenizeInline(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const boldStart = text.indexOf("**", i);
    const codeStart = text.indexOf("`", i);
    const next = [boldStart, codeStart].filter((n) => n !== -1).sort((a, b) => a - b)[0];

    if (next === undefined) {
      out.push({ type: "text", value: text.slice(i) });
      break;
    }
    if (next > i) out.push({ type: "text", value: text.slice(i, next) });

    if (next === boldStart) {
      const end = text.indexOf("**", boldStart + 2);
      if (end === -1) {
        out.push({ type: "text", value: text.slice(boldStart) });
        break;
      }
      out.push({ type: "bold", value: text.slice(boldStart + 2, end) });
      i = end + 2;
      continue;
    }

    const end = text.indexOf("`", codeStart + 1);
    if (end === -1) {
      out.push({ type: "text", value: text.slice(codeStart) });
      break;
    }
    out.push({ type: "code", value: text.slice(codeStart + 1, end) });
    i = end + 1;
  }
  return out;
}

export function MarkdownLite({ children }) {
  const raw = typeof children === "string" ? children : "";
  const lines = raw.split(/\r?\n/);

  const blocks = [];
  let list = null;

  function flushList() {
    if (!list) return;
    blocks.push({ type: "ul", items: list });
    list = null;
  }

  for (const line of lines) {
    const m = line.match(/^\s*-\s+(.*)$/);
    if (m) {
      if (!list) list = [];
      list.push(m[1]);
      continue;
    }
    flushList();
    blocks.push({ type: "p", text: line });
  }
  flushList();

  return createElement(
    Fragment,
    null,
    blocks.map((b, idx) => {
      if (b.type === "ul") {
        return createElement(
          "ul",
          { key: `ul_${idx}` },
          b.items.map((item, i) => createElement("li", { key: `li_${idx}_${i}` }, renderInline(item))),
        );
      }
      return createElement("p", { key: `p_${idx}` }, b.text ? renderInline(b.text) : createElement("br"));
    }),
  );
}

function renderInline(text) {
  const tokens = tokenizeInline(text);
  return tokens.map((t, i) => {
    if (t.type === "bold") return createElement("strong", { key: i }, t.value);
    if (t.type === "code") return createElement("code", { key: i }, t.value);
    return createElement(Fragment, { key: i }, t.value);
  });
}


"use client";

import { useMemo } from "react";

type Token =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "blockquote"; lines: string[] }
  | { type: "hr" }
  | { type: "image"; src: string; alt: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; alignments: string[]; rows: string[][] }
  | { type: "p"; text: string };

function parseMarkdown(content: string): Token[] {
  const lines = content.split("\n");
  const tokens: Token[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // hr
    if (/^---+$/.test(line.trim())) {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    // h2
    if (line.startsWith("## ")) {
      tokens.push({ type: "h2", text: line.slice(3).trim() });
      i++;
      continue;
    }

    // h3
    if (line.startsWith("### ")) {
      tokens.push({ type: "h3", text: line.slice(4).trim() });
      i++;
      continue;
    }

    // image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      tokens.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // unordered list
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i++;
      }
      tokens.push({ type: "list", items });
      continue;
    }

    // blockquote
    if (line.startsWith("> ")) {
      const bqLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        bqLines.push(lines[i].slice(2));
        i++;
      }
      tokens.push({ type: "blockquote", lines: bqLines });
      continue;
    }

    // table
    if (line.includes("|") && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())) {
      const headerLine = line.trim();
      const separatorLine = lines[i + 1].trim();
      const headers = headerLine.split("|").filter(Boolean).map((c) => c.trim());
      const alignments = separatorLine.split("|").filter(Boolean).map((c) => {
        const t = c.trim();
        if (t.startsWith(":") && t.endsWith(":")) return "center";
        if (t.endsWith(":")) return "right";
        return "left";
      });
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      tokens.push({ type: "table", headers, alignments, rows });
      continue;
    }

    // paragraph (collect consecutive non-empty lines)
    const pLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].startsWith("## ") && !lines[i].startsWith("### ") && !lines[i].startsWith("> ") && !/^---+$/.test(lines[i].trim())) {
      pLines.push(lines[i]);
      i++;
    }
    if (pLines.length > 0) {
      tokens.push({ type: "p", text: pLines.join("\n") });
    }
  }

  return tokens;
}

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <strong key={key++} className="font-bold text-foreground">
        {match[2]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const tokens = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className="prose-custom">
      {tokens.map((token, i) => {
        switch (token.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="text-2xl font-bold mt-14 mb-6 pb-3 border-b border-border/60 text-foreground"
              >
                {token.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="text-xl font-bold mt-10 mb-4 text-foreground"
              >
                {token.text}
              </h3>
            );
          case "hr":
            return (
              <hr key={i} className="my-12 border-border/60" />
            );
          case "image":
            return (
              <figure key={i} className="my-8">
                <img
                  src={token.src}
                  alt={token.alt}
                  className="w-full rounded-xl"
                  loading="lazy"
                />
                {token.alt && (
                  <figcaption className="text-xs text-zinc-400 text-center mt-2">
                    {token.alt}
                  </figcaption>
                )}
              </figure>
            );
          case "list":
            return (
              <ul key={i} className="my-6 space-y-2">
                {token.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-zinc-600 leading-[1.9]">
                    <span className="text-primary mt-1 shrink-0">▸</span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "blockquote":
            return (
              <blockquote
                key={i}
                className="my-8 border-l-4 border-primary pl-6 py-2 bg-blue-50/50 rounded-r-lg"
              >
                {token.lines.map((line, j) => (
                  <p key={j} className="text-zinc-700 leading-relaxed italic">
                    {renderInline(line)}
                  </p>
                ))}
              </blockquote>
            );
          case "table":
            return (
              <div key={i} className="my-8 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full border-collapse text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-zinc-50">
                      {token.headers.map((h, j) => (
                        <th
                          key={j}
                          className="border border-border/60 px-4 py-3 font-bold text-left text-zinc-700"
                          style={{ textAlign: token.alignments[j] as "left" | "center" | "right" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {token.rows.map((row, j) => (
                      <tr key={j} className="even:bg-zinc-50/50">
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="border border-border/60 px-4 py-3 text-zinc-600"
                            style={{ textAlign: token.alignments[k] as "left" | "center" | "right" }}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "p":
            return (
              <p key={i} className="text-zinc-600 leading-[1.9] mb-4 md:mb-6">
                {renderInline(token.text)}
              </p>
            );
        }
      })}
    </div>
  );
}

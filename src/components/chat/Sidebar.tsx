import { motion } from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Conversation } from "../../data/mock";
import { currentUserHandle, currentUserId } from "../../data/mock";
import { useCanHover } from "../../hooks/useCanHover";
import { cn } from "../../lib/cn";
import { IconSearch, IconX } from "../icons";
import { Avatar } from "../ui/avatar";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { ThemeToggle } from "../ui/theme-toggle";

// Light-weight highlighter for search query inside a text
function highlightQuery(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  const before = text.slice(0, i);
  const match = text.slice(i, i + q.length);
  const after = text.slice(i + q.length);
  return (
    <>
      {before}
      <mark className="rounded bg-yellow-200/60 px-0.5 py-0 text-(--text)">
        {match}
      </mark>
      {after}
    </>
  );
}

export const Sidebar: React.FC<{
  items: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
}> = ({ items, activeId, onSelect }) => {
  const canHover = useCanHover();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const listRef = useRef<HTMLUListElement | null>(null);
  const [focusIndex, setFocusIndex] = useState<number>(0);

  // debounce for smoother filtering on big lists
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 120);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return items;
    const q = debouncedQuery.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.lastMessage.toLowerCase().includes(q)
    );
  }, [items, debouncedQuery]);

  // keep focusIndex in range and synced with activeId
  useEffect(() => {
    const idx = filtered.findIndex((c) => c.id === activeId);
    setFocusIndex(idx >= 0 ? idx : 0);
  }, [filtered, activeId]);

  // ensure focused item is visible when navigating with keyboard
  useEffect(() => {
    const el = listRef.current?.children?.[focusIndex] as
      | HTMLElement
      | undefined;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [focusIndex]);

  const onKeyDownList = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (!filtered.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocusIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setFocusIndex(filtered.length - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = filtered[focusIndex];
        if (target) onSelect(target.id);
      }
    },
    [filtered, focusIndex, onSelect]
  );

  return (
    <div className="flex h-full w-full md:w-80 flex-col md:border-r border-(--border) bg-(--sidebar)">
      <div className="p-3">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-neutral-400">
            <IconSearch className="size-4" />
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="bg-(--panel) border-(--border) text-(--text) placeholder:text-neutral-400 pl-8 pr-8"
          />
          {query ? (
            <button
              aria-label="Clear search"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400",
                canHover && "hover:bg-(--muted)"
              )}
              onClick={() => setQuery("")}
            >
              <IconX className="size-4" />
            </button>
          ) : null}
        </div>
      </div>
      <ScrollArea variant="hidden" className="flex-1">
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={0}
          aria-activedescendant={
            filtered[focusIndex]?.id
              ? `chat-opt-${filtered[focusIndex].id}`
              : undefined
          }
          onKeyDown={onKeyDownList}
          className="px-2 flex flex-col gap-1 py-2 outline-none focus-visible:ring-2 focus-visible:ring-(--border) rounded-md"
        >
          {filtered.map((c, idx) => (
            <li
              key={c.id}
              id={`chat-opt-${c.id}`}
              role="option"
              aria-selected={activeId === c.id}
            >
              <motion.button
                onClick={() => onSelect(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                  canHover && "hover:bg-(--muted)",
                  activeId === c.id && "bg-(--muted)",
                  focusIndex === idx && "md:ring-2 md:ring-(--border)"
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={canHover ? { scale: 1.01 } : undefined}
                transition={{
                  delay: Math.min(idx * 0.015, 0.15),
                  duration: 0.2,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Avatar
                  size="sm"
                  src={c.avatar || undefined}
                  fallback={c.name[0]}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {c.name}
                    </span>
                    {typeof c.unread === "number" && c.unread > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black dark:bg-(--primary) px-1 text-xs font-medium text-white">
                        {c.unread}
                      </span>
                    ) : null}
                  </div>
                  <div className="truncate text-xs opacity-70">
                    {debouncedQuery
                      ? highlightQuery(c.lastMessage, debouncedQuery)
                      : c.lastMessage}
                  </div>
                </div>
              </motion.button>
            </li>
          ))}
          {filtered.length === 0 ? (
            <li className="px-2 py-6 text-center text-sm opacity-70">
              No results
            </li>
          ) : null}
        </ul>
      </ScrollArea>
      <div className="border-t border-(--border) p-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback="ME" />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">You</div>
            <div className="truncate text-xs opacity-70">
              @{currentUserHandle} • {currentUserId}
            </div>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

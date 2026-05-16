import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./AIChat.css";
import { Button } from "../ui/Button/Button";
import { Card } from "../ui/Card/Card";
import { Loader } from "../ui/Loader/Loader";
import { MarkdownLite } from "../../utils/markdown";
import { translations } from "../../i18n/translations";
import { sendChat } from "../../utils/chat";

const MAX_HISTORY = 20;

function resetChatState(setters) {
  setters.setHistory([]);
  setters.setInput("");
  setters.setError("");
  setters.setLoading(false);
}

export default function AIChat({ t, lang }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const abortRef = useRef(null);

  const chips = useMemo(() => t.chat.chips, [t]);

  useEffect(() => {
    try {
      localStorage.removeItem("km_chat_history");
    } catch {
      // ignore
    }
  }, []);

  const openChat = useCallback(() => {
    abortRef.current?.abort?.();
    resetChatState({ setHistory, setInput, setError, setLoading });
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    abortRef.current?.abort?.();
    resetChatState({ setHistory, setInput, setError, setLoading });
    setOpen(false);
  }, []);

  useEffect(() => {
    const onOpen = () => openChat();
    window.addEventListener("km_open_chat", onOpen);
    return () => window.removeEventListener("km_open_chat", onOpen);
  }, [openChat]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeChat]);

  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia("(max-width: 480px)");
    if (!mobile.matches) {
      document.body.dataset.chatOpen = "true";
      return () => delete document.body.dataset.chatOpen;
    }
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.dataset.chatOpen = "true";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      delete document.body.dataset.chatOpen;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [history, loading]);

  const onSend = async (text) => {
    const content = String(text || "").trim();
    if (!content || loading) return;
    setError("");

    const next = [...history, { role: "user", content }].slice(-MAX_HISTORY);
    setHistory(next);
    setInput("");
    setLoading(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const message = await sendChat({
        messages: next,
        lang,
        signal: ctrl.signal,
        translations,
      });
      setHistory((prev) =>
        [...(Array.isArray(prev) ? prev : []), { role: "assistant", content: message }].slice(-MAX_HISTORY),
      );
    } catch (e) {
      if (e?.name !== "AbortError") {
        setError(e instanceof Error ? e.message : "Chat error");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const onClear = () => {
    abortRef.current?.abort?.();
    resetChatState({ setHistory, setInput, setError, setLoading });
  };

  return (
    <>
      <button
        className="chatFab"
        type="button"
        aria-label={t.chat.title}
        aria-expanded={open}
        onClick={() => (open ? closeChat() : openChat())}
      >
        <span className="chatFab__pulse" aria-hidden="true" />
        <span className="chatFab__icon" aria-hidden="true">
          AI
        </span>
        <span className="chatFab__label">{t.chat.fabLabel}</span>
      </button>

      <div className={["chatWrap", open ? "is-open" : ""].join(" ")} aria-hidden={!open}>
        <Card className="chatPanel" role="dialog" aria-modal="true" aria-label={t.chat.title}>
          <div className="chatTop">
            <div className="chatTop__left">
              <div className="chatTop__title">{t.chat.title}</div>
              <div className="chatTop__sub">OpenRouter</div>
            </div>
            <div className="chatTop__right">
              <Button variant="subtle" onClick={onClear} disabled={loading}>
                {t.chat.clear}
              </Button>
              <Button variant="ghost" onClick={closeChat}>
                Close
              </Button>
            </div>
          </div>

          <div className="chatBody" ref={listRef}>
            {history.length === 0 ? (
              <div className="chatEmpty">
                <p className="chatEmpty__title">Quick questions</p>
                <div className="chatChips">
                  {chips.map((c) => (
                    <button key={c} className="chatChip" type="button" onClick={() => onSend(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {history.map((m, i) => (
              <div key={`${m.role}_${i}`} className={["chatMsg", `chatMsg--${m.role}`].join(" ")}>
                <div className="chatMsg__bubble">
                  <MarkdownLite>{m.content}</MarkdownLite>
                </div>
              </div>
            ))}

            {loading ? (
              <div className="chatMsg chatMsg--assistant">
                <div className="chatMsg__bubble chatMsg__typing">
                  <Loader label="Typing" />
                </div>
              </div>
            ) : null}

            {error ? <div className="chatError">{error}</div> : null}
          </div>

          <form
            className="chatComposer"
            onSubmit={(e) => {
              e.preventDefault();
              void onSend(input);
            }}
          >
            <input
              className="chatInput"
              value={input}
              placeholder={t.chat.placeholder}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoComplete="off"
              enterKeyHint="send"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {t.chat.send}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}

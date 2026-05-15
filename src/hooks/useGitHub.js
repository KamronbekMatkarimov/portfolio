import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "KamronbekMatkarimov";
const DEFAULT_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export function useGitHub({ username = DEFAULT_USERNAME, perPage = 9 } = {}) {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const endpoint = useMemo(() => {
    const u = encodeURIComponent(username);
    return `https://api.github.com/users/${u}/repos?sort=updated&per_page=${perPage}`;
  }, [username, perPage]);

  const fetchRepos = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const headers = {
        Accept: "application/vnd.github+json",
      };
      if (DEFAULT_TOKEN) headers.Authorization = `Bearer ${DEFAULT_TOKEN}`;

      const res = await fetch(endpoint, { headers });
      if (!res.ok) {
        const msg = `GitHub request failed (${res.status})`;
        throw new Error(msg);
      }
      const data = await res.json();
      setRepos(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (e) {
      setRepos([]);
      setStatus("error");
      setError(e instanceof Error ? e : new Error("Unknown error"));
    }
  }, [endpoint]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetchRepos();
    }, 0);
    return () => window.clearTimeout(id);
  }, [fetchRepos]);

  return { repos, status, error, refetch: fetchRepos };
}


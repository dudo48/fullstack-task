export const fetcher = (
  url: string | URL,
  init?: RequestInit,
): Promise<any> => {
  return fetch(url, init).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });
};

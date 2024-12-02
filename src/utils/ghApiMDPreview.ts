async function ghApiMDPreview(markdown: string): Promise<string> {
  const req = new Request('https://bund.penclub.club/?https://api.github.com/markdown', {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ text: markdown, mode: 'gfm' }),
  });
  const res = await fetch(req);
  return res.json();
}

export default ghApiMDPreview;

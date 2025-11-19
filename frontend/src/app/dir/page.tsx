export default async function TestPage() {
  const apiUrl = process.env.API_URL_SERVER; // 環境変数からAPIのURLを取得
  const res = await fetch(`${apiUrl}/hello`, {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div>
      <h1>API Response</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
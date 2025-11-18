export default async function TestPage() {
  const res = await fetch("http://localhost:8000/hello", {
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
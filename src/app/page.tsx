import LogTable from "@/components/LogTable";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

console.log(`API URL: ${apiUrl}`);

export default function Home() {
  return (
    <main>
      <LogTable />
    </main>
  );
}

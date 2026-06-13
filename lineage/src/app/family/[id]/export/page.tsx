import ExportClient from "./ExportClient";

export function generateStaticParams() {
  return [{ id: "johnson" }, { id: "okafor" }, { id: "new-family" }];
}

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExportClient id={id} />;
}

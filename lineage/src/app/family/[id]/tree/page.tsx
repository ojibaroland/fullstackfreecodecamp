import TreeClient from "./TreeClient";

export function generateStaticParams() {
  return [{ id: "johnson" }, { id: "okafor" }, { id: "new-family" }];
}

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TreeClient id={id} />;
}

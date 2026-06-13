import PersonClient from "./PersonClient";

export function generateStaticParams() {
  return [
    "gf","gm","f","m","u","liam","mia","noah","a1","c1","c2","ella","owen",
  ].map((id) => ({ id }));
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PersonClient id={id} />;
}

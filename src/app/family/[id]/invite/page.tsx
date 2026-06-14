import InviteClient from "./InviteClient";

export function generateStaticParams() {
  return [{ id: "johnson" }, { id: "okafor" }, { id: "new-family" }];
}

export default async function InvitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InviteClient id={id} />;
}

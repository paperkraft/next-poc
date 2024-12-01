import EditGroup from "./EditGroup";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return <EditGroup id={id} />
}
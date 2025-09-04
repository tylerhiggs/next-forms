import { FormPreview } from "@/components/form-preview";
import { getFormById } from "@/src/actions/forms";

export default async function PublicForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    return <div>No ID provided</div>;
  }
  if (isNaN(Number(id))) {
    return <div>Invalid ID provided</div>;
  }
  const form = await getFormById(Number(id));

  return <FormPreview form={form} />;
}

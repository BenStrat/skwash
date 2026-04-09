export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section className="rounded-xl border border-dashed bg-white p-8">
      <h1 className="text-xl font-semibold">Project {id}</h1>
      <p className="mt-2 text-sm text-zinc-600">Canvas and annotations are intentionally deferred beyond Phase 0.</p>
    </section>
  );
}

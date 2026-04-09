export default async function ProjectClustersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section className="rounded-xl border border-dashed bg-white p-8">
      <h1 className="text-xl font-semibold">Project {id} clusters</h1>
      <p className="mt-2 text-sm text-zinc-600">Cluster review tooling is deferred to later phases.</p>
    </section>
  );
}

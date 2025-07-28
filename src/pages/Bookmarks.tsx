import Layout from "@/components/Layout";

const Bookmarks = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Bookmarks</h1>
        <p className="text-muted-foreground">Your saved internships will be displayed here.</p>
      </div>
    </Layout>
  );
};

export default Bookmarks;
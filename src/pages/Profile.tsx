import Layout from "@/components/Layout";

const Profile = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">Profile</h1>
        <p className="text-muted-foreground">Your profile information will be displayed here.</p>
      </div>
    </Layout>
  );
};

export default Profile;
import Layout from "../admin";
import AddAgencyComponent from "../volunteer/add-volunteer-cooperative";

export default function AddAgency() {
  return (
    <Layout>
      <AddAgencyComponent isAdmin={true} />
    </Layout>
  );
}

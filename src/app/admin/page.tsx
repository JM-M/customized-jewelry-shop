import { redirect } from "next/navigation";

const AdminPage = () => {
  redirect("/admin/dashboard");

  return null;
};
export default AdminPage;

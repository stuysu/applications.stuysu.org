import { useRouter } from "next/router";
import AdminRequired from "../../../comps/admin/AdminRequired";

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AdminRequired>
      <div>
        <p>{id}</p>
      </div>
    </AdminRequired>
  );
}

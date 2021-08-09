import AdminRequired from "../../../comps/admin/AdminRequired";
import styles from "./../../../styles/Admin.module.css";

export default function CreateApplication() {
  return (
    <AdminRequired>
      <div className={styles.container}></div>
    </AdminRequired>
  );
}

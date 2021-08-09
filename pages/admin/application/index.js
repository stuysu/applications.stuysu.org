import Typography from "@material-ui/core/Typography";
import AdminRequired from "../../../comps/admin/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "../../../styles/Admin.module.css";

export default function ApplicationAdmin() {
  return (
    <AdminRequired>
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />
      </div>
    </AdminRequired>
  );
}

import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "./../../../styles/Admin.module.css";

export default function FAQAdmin() {
  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />
    </div>
  );
}

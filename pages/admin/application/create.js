import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import ApplicationForm from "../../../comps/application/ApplicationForm";
import styles from "./../../../styles/Admin.module.css";

export default function CreateApplication() {
  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <Typography variant={"h5"} align={"center"}>
        Create Application
      </Typography>

      <div className={styles.center}>
        <ApplicationForm submitLabel={"Create"} />
      </div>
    </div>
  );
}

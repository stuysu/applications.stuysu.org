import Typography from "@material-ui/core/Typography";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "./../../../styles/Admin.module.css";

export default function UserAdmin() {
  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />
      <Typography align={"center"} variant={"body1"}>
        You can edit users on this page and add/remove admins. <br />
        If you can't find a certain user, it's likely their account doesn't
        exist. <br />
        Ask them to sign into the site and an account will be created for them.
      </Typography>
    </div>
  );
}

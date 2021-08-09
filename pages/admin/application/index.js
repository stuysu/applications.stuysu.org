import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddOutlined from "@material-ui/icons/AddOutlined";
import Link from "next/link";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import styles from "../../../styles/Admin.module.css";

export default function ApplicationAdmin() {
  return (
    <div className={styles.container}>
      <Typography variant={"h4"} align={"center"}>
        Admin Panel
      </Typography>
      <AdminTabBar />

      <div className={styles.center}>
        <Link href={"/admin/application/create"}>
          <a>
            <Button
              startIcon={<AddOutlined />}
              variant={"contained"}
              color={"primary"}
            >
              Create Application
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}

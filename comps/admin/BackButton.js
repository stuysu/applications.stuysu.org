import Button from "@material-ui/core/Button";
import ArrowBackIosOutlined from "@material-ui/icons/ArrowBackIosOutlined";
import Link from "next/link";
import styles from "../../styles/Admin.module.css";

export default function BackButton({ href, label }) {
  return (
    <div className={styles.center}>
      <div className={styles.tabBarWidthContainer}>
        <Link href={href}>
          <a>
            <Button
              variant={"outlined"}
              color={"primary"}
              startIcon={<ArrowBackIosOutlined />}
              children={label}
            />
          </a>
        </Link>
      </div>
    </div>
  );
}

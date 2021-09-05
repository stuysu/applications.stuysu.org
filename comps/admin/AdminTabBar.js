import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Assessment from "@material-ui/icons/AssessmentOutlined";
import Help from "@material-ui/icons/HelpOutline";
import People from "@material-ui/icons/PeopleOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./AdminTabBar.module.css";

const pages = [
  {
    label: "Applications",
    href: "/admin/application",
    active: /^\/admin\/application/,
    icon: <Assessment />,
  },
  {
    label: "Users",
    href: "/admin/user",
    active: /^\/admin\/user/,
    icon: <People />,
  },
  {
    label: "FAQs",
    href: "/admin/faq",
    active: /^\/admin\/faq/,
    icon: <Help />,
  },
];

function getActivePageIndex(pathname) {
  return pages.findIndex(({ active }) => pathname.match(active));
}

export default function AdminTabBar() {
  const router = useRouter();
  const { pathname } = router;
  const previousPath = globalThis.sessionStorage?.getItem(
    "previous-admin-path"
  );

  const [activeTabIndex, setActiveTabIndex] = useState(
    previousPath ? getActivePageIndex(previousPath) : 0
  );

  useEffect(() => {
    setActiveTabIndex(getActivePageIndex(pathname));
    globalThis.sessionStorage.setItem("previous-admin-path", pathname);
  }, [pathname]);

  return (
    <Tabs
      className={styles.tabs}
      value={activeTabIndex}
      indicatorColor="primary"
      textColor="primary"
      aria-label={"Admin Tab List"}
      centered
    >
      {pages.map(({ label, href, icon }) => (
        <Link key={label} href={href} passHref>
          <Tab
            label={label}
            icon={icon}
            color={"secondary"}
            aria-label={"tab for " + label}
          />
        </Link>
      ))}
    </Tabs>
  );
}

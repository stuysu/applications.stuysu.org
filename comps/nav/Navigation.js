import { useState } from "react";
import TopAppBar from "./TopAppBar";
import NavDrawer from "./NavDrawer";
import Home from "@material-ui/icons/HomeOutlined";
import AccountTree from "@material-ui/icons/AccountTreeOutlined";
import Help from "@material-ui/icons/HelpOutline";

const pages = [
  {
    label: "Home",
    active: /^\/$/,
    href: "/",
    signedIn: null,
    adminPrivileges: null,
    icon: <Home />,
  },
  {
    label: "Admin",
    active: /^\/admin/,
    href: "/admin",
    signedIn: true,
    adminPrivileges: true,
    icon: <AccountTree />,
  },
  {
    label: "FAQs",
    active: /^\/faq/,
    href: "/faq",
    signedIn: null,
    adminPrivileges: null,
    icon: <Help />,
  },
];

export default function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <TopAppBar pages={pages} setDrawerOpen={setDrawerOpen} />
      <NavDrawer open={drawerOpen} setOpen={setDrawerOpen} pages={pages} />
    </div>
  );
}

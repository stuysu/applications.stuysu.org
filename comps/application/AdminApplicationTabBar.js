import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Link from "next/link";
import { useRouter } from "next/router";

const pages = [
  {
    title: "Info",
    active: ["/admin/application/[id]"],
    href: "/admin/application/[id]",
  },
  {
    title: "Results",
    active: ["/admin/application/[id]/results"],
    href: "/admin/application/[id]/results",
  },
  {
    title: "Applicants",
    active: ["/admin/application/[id]/applicants"],
    href: "/admin/application/[id]/applicants",
  },
];

export default function AdminApplicationTabBar() {
  const router = useRouter();
  const { id } = router.query;
  const currentTab = pages.findIndex(page =>
    page.active.some(url => url === router.pathname)
  );

  return (
    <Paper style={{ margin: "1rem" }}>
      <Tabs
        indicatorColor="secondary"
        textColor="secondary"
        value={currentTab}
        centered
      >
        {pages.map(({ href, title }) => (
          <Link key={href} href={href.replace(/\[id]/g, id)} passHref>
            <Tab
              label={title}
              color={"secondary"}
              aria-label={"tab for " + title}
            />
          </Link>
        ))}
      </Tabs>
    </Paper>
  );
}

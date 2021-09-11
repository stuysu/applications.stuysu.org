import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import ArrowBackIosOutlined from "@material-ui/icons/ArrowBackIosOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactGA from "react-ga";

export default function BackButton({ href, label }) {
  const router = useRouter();
  const { noNavigation } = router.query;

  if (noNavigation === "true") {
    return null;
  }

  return (
    <Container maxWidth={"md"} style={{ marginBottom: 10 }}>
      <Link href={href} passHref>
        <Button
          variant={"outlined"}
          color={"primary"}
          startIcon={<ArrowBackIosOutlined />}
          children={label}
          onClick={() => {
            if (globalThis.window) {
              ReactGA.event({
                category: "Interaction",
                action: "Clicked Back Button",
                label: router.pathname,
                nonInteraction: false,
              });
            }
          }}
        />
      </Link>
    </Container>
  );
}

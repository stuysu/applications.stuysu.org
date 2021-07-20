import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/application");
  }, []);

  return null;
}

import { gql, useMutation, useQuery } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosOutlined from "@material-ui/icons/ArrowBackIosOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import AdminRequired from "../../../comps/admin/AdminRequired";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import UserContext from "../../../comps/auth/UserContext";
import styles from "./../../../styles/Admin.module.css";
const QUERY = gql`
  query ($id: ObjectID!) {
    userById(id: $id) {
      id
      picture
      name
      firstName
      lastName
      email
      adminPrivileges
    }
  }
`;

const EDIT_MUTATION = gql`
  mutation ($id: ObjectID!, $adminPrivileges: Boolean!) {
    editUser(id: $id, adminPrivileges: $adminPrivileges) {
      id
      adminPrivileges
    }
  }
`;

const ObjectIdRegex = /^[A-Fa-f0-9]{24}$/;

export default function EditUser() {
  const { adminPrivileges } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const isValidId = ObjectIdRegex.test(id || "");

  const { data, loading } = useQuery(QUERY, {
    variables: { id },
    skip: !isValidId || !adminPrivileges,
  });

  const [update, { loading: updating }] = useMutation(EDIT_MUTATION);

  const setAdminPrivileges = async bool => {
    try {
      await update({ variables: { id, adminPrivileges: bool } });
    } catch (e) {
      alert("There was an error " + e.message);
      console.log(e);
    }
  };

  if (adminPrivileges && id && !isValidId) {
    return (
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />
        <Typography
          variant={"h5"}
          align={"center"}
          color={"error"}
          gutterBottom
        >
          That ID is not valid.
        </Typography>
        <div className={styles.center}>
          <Link href={"/admin/user"}>
            <a>
              <Button
                variant={"contained"}
                color={"primary"}
                startIcon={<ArrowBackIosOutlined />}
              >
                Back To Users
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (!data || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.center}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  const user = data?.userById;

  if (!user) {
    return (
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />
        <Typography
          variant={"h5"}
          align={"center"}
          color={"error"}
          gutterBottom
        >
          There is no user with that id
        </Typography>
        <div className={styles.center}>
          <Link href={"/admin/user"}>
            <a>
              <Button
                variant={"contained"}
                color={"primary"}
                startIcon={<ArrowBackIosOutlined />}
              >
                Back To Users
              </Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminRequired>
      <div className={styles.container}>
        <Typography variant={"h4"} align={"center"}>
          Admin Panel
        </Typography>
        <AdminTabBar />

        <div className={styles.center}>
          <div className={styles.tabBarWidthContainer}>
            <Link href={"/admin/user"}>
              <a>
                <Button
                  variant={"outlined"}
                  color={"primary"}
                  startIcon={<ArrowBackIosOutlined />}
                >
                  Back To Users
                </Button>
              </a>
            </Link>
          </div>
        </div>

        <Typography variant={"h5"} align={"center"} gutterBottom>
          Manage User
        </Typography>

        <div className={styles.center}>
          <Avatar
            alt={user.name}
            src={user.picture}
            className={styles.manageUserAvatar}
          />
        </div>

        <div className={styles.center}>
          <div className={styles.tabBarWidthContainer}>
            <Typography>
              Name: <b>{user.name}</b>
            </Typography>
            <Typography>
              Email: <b>{user.email}</b>
            </Typography>
            <br />
            <Typography variant={"subtitle1"}>
              The name, picture, and email information is automatically updated
              every time the user signs in and so they are not allowed to be
              changed
            </Typography>

            <br />

            <Typography variant={"subtitle1"}>
              This user currently{" "}
              {user.adminPrivileges ? (
                <Typography variant={"inherit"} color={"primary"}>
                  <b>has</b> admin privileges
                </Typography>
              ) : (
                <Typography variant={"inherit"} color={"error"}>
                  <b>does not</b> have admin privileges
                </Typography>
              )}
            </Typography>
          </div>
        </div>
      </div>
    </AdminRequired>
  );
}

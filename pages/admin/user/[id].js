import { gql, useMutation, useQuery } from "@apollo/client";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosOutlined from "@material-ui/icons/ArrowBackIosOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import AdminTabBar from "../../../comps/admin/AdminTabBar";
import BackButton from "../../../comps/admin/BackButton";
import UserContext from "../../../comps/auth/UserContext";
import { ObjectIdRegex } from "../../../constants";
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

const AdminHeading = () => (
  <>
    <Typography variant={"h4"} align={"center"}>
      Admin Panel
    </Typography>
    <AdminTabBar />
  </>
);

export default function EditUser() {
  const { id: authenticatedUserId } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const isValidId = ObjectIdRegex.test(id || "");

  const { data, loading } = useQuery(QUERY, {
    variables: { id },
    skip: !isValidId,
  });

  const [update, { loading: updating }] = useMutation(EDIT_MUTATION);

  const setAdminPrivileges = async bool => {
    const message = bool
      ? "Are you sure you want to give this user admin privileges? They will be able to access this panel or even remove your own privileges."
      : "Are you sure you want to remove this user's admin privileges? This is only necessary if this user should not have access to the admin panel.";

    const confirmation = window.confirm(message);

    if (!confirmation) {
      return;
    }

    try {
      await update({ variables: { id, adminPrivileges: bool } });
    } catch (e) {
      alert("There was an error " + e.message);
      console.log(e);
    }
  };

  if (id && !isValidId) {
    return (
      <div className={styles.container}>
        <AdminHeading />

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
        <AdminHeading />
        <div className={styles.center}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  const user = data?.userById;
  const userIsSelf = authenticatedUserId === id;

  if (!user) {
    return (
      <div className={styles.container}>
        <AdminHeading />

        <Typography
          variant={"h5"}
          align={"center"}
          color={"error"}
          gutterBottom
        >
          There is no user with that id
        </Typography>
        <BackButton href={"/admin/user"} label={"Back To Users"} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminHeading />
      <BackButton href={"/admin/user"} label={"Back To Users"} />

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

          <Typography variant={"subtitle1"} gutterBottom>
            This user currently{" "}
            <Typography
              variant={"inherit"}
              color={user.adminPrivileges ? "primary" : "error"}
            >
              <b>{user.adminPrivileges ? "has" : "does not have"}</b>
            </Typography>{" "}
            admin privileges
          </Typography>
        </div>
      </div>

      <br />

      <div className={styles.center}>
        <Button
          variant={"contained"}
          color={user.adminPrivileges ? "secondary" : "primary"}
          disabled={updating || userIsSelf}
          onClick={() => setAdminPrivileges(!user.adminPrivileges)}
        >
          {user.adminPrivileges
            ? "Remove Admin Privileges"
            : "Give Admin Privileges"}
        </Button>
      </div>

      {userIsSelf && (
        <Typography variant={"subtitle1"} color={"error"} align={"center"}>
          You are not allowed to remove your own admin privileges. <br /> Ask
          another admin to do it for you if necessary.
        </Typography>
      )}
    </div>
  );
}

import { gql } from "@apollo/client";

const QUERY = gql`
  query ($id: ObjectID!, $loadApplicants: Boolean!) {
    applicationById(id: $id) {
      id
      title
      url
    }
  }
`;

export default function ApplicationApplicants() {
  return (
    <div>
      <a></a>
    </div>
  );
}

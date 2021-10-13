import { API_URL } from "src/views/base/components/constants";
export const getDataAccounts = async (props) =>
  fetch(`${API_URL}/api/projects/detail-project/` + props)
    .then((response) => response.json())
    .then((json) => json["data"]);

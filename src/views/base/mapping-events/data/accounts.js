import { API_URL } from "src/views/base/components/constants";
export const getDataAccounts = async () =>
  fetch(`${API_URL}/api/accounts`)
    .then((response) => response.json())
    .then((json) => json["data"]);

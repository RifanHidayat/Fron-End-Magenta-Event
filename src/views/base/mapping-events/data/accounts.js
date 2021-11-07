import { API_URL, FINANCE_API } from "src/views/base/components/constants";
export const getDataAccounts = async () =>
  fetch(`${FINANCE_API}/api/account`)
    .then((response) => response.json())
    .then((json) => json["data"]);

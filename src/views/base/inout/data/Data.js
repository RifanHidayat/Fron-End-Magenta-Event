import { API_URL, FINANCE_API } from "src/views/base/components/constants";
export const getInOutNumber = async (props) =>
  fetch(`${API_URL}/api/inout/inout-number`)
    .then((response) => response.json())
    .then((json) => json);

export const getAcounts = async (props) =>
  fetch(`${FINANCE_API}/api/account`)
    .then((response) => response.json())
    .then((json) => json);

export const getInOutTransaction = async (props) =>
  fetch(`${FINANCE_API}/api/inout-transaction`)
    .then((response) => response.json())
    .then((json) => json);

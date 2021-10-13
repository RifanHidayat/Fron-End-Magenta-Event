import { API_URL } from "src/views/base/components/constants";
export const getInOutNumber = async (props) =>
  fetch(`${API_URL}/api/inout/inout-number`)
    .then((response) => response.json())
    .then((json) => json);

export const getAcounts = async (props) =>
  fetch(`${API_URL}/api/accounts`)
    .then((response) => response.json())
    .then((json) => json);

export const getInOutTransaction = async (props) =>
  fetch(`${API_URL}/api/inout`)
    .then((response) => response.json())
    .then((json) => json);

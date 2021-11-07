import { API_URL, FINANCE_API } from "src/views/base/components/constants";
export const getAllPIC = async (props) =>
  fetch(`${API_URL}/api/pic`)
    .then((response) => response.json())
    .then((json) => json);

export const getDetailPIC = async (props) =>
  fetch(`${API_URL}/api/pic/detail-pictb/` + props)
    .then((response) => response.json())
    .then((json) => json);

export const getAllFaktur = async (props) =>
  fetch(`${API_URL}/api/faktur`)
    .then((response) => response.json())
    .then((json) => json);

export const getAllPICTB = async (props) =>
  fetch(`${API_URL}/api/pic/pic-tb`)
    .then((response) => response.json())
    .then((json) => json);

export const getAllProjets = async (props) =>
  fetch(`${API_URL}/api/projects`)
    .then((response) => response.json())
    .then((json) => json);

export const dataPDF = async (props) =>
  fetch(`${API_URL}/api/pic/detail-pictb/` + props)
    .then((response) => response.json())
    .then((json) => json);

export const DataInTransactions = async (id) =>
  fetch(`${API_URL}/api/pictb/${id}/transactions/in`)
    .then((response) => response.json())
    .then((json) => json);

export const DataOutTransactions = async (id) =>
  fetch(`${API_URL}/api/pictb/${id}/transactions/out`)
    .then((response) => response.json())
    .then((json) => json);

export const getInOutNumber = async (props) =>
  fetch(`${API_URL}/api/inout/inout-number`)
    .then((response) => response.json())
    .then((json) => json);

export const getAcounts = async (props) =>
  fetch(`${FINANCE_API}/api/account`)
    .then((response) => response.json())
    .then((json) => json);

export const getInOutTransaction = async (props) =>
  fetch(`${API_URL}/api/add-tb-transactions/` + props)
    .then((response) => response.json())
    .then((json) => json);

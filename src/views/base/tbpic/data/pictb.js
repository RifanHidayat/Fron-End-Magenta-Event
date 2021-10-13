import { API_URL } from "src/views/base/components/constants";
export const getAllPICTB = async (props) =>
  fetch(`${API_URL}/api/pic/pic-tb`)
    .then((response) => response.json())
    .then((json) => json);

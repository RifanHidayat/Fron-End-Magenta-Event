import { API_URL } from "src/views/base/components/constants";
export const getProjects = async (props) =>
  fetch(`${API_URL}/api/projects`)
    .then((response) => response.json())
    .then((json) => json["data"]);

export const totalStatus = async (props) =>
  fetch(`${API_URL}/api/projects/count-status`)
    .then((response) => response.json())
    .then((json) => json);

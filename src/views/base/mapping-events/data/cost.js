import { API_URL } from "src/views/base/components/constants";
export const getDataCostProjects = async (props) =>
  fetch(`${API_URL}/api/projects/` + props + "/cost")
    .then((response) => response.json())
    .then((json) => json);

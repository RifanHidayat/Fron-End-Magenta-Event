import React, { useState, useEffect } from "react";

import Table from "./components/DataTable";
import { CButton, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { getAllPICTB } from "./data/pictb";
import BeatLoader from "react-spinners/BeatLoader";

function Manage() {
  const [pictb, setPictb] = useState([]);
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("permission"));
    const permission = data.filter((value) => value === "pictb");
    if (permission <= 0) {
      Navigator.push("/dashboard");
    }
    getAllPICTB().then((response) => {
      setIsLoading(true);
      setPictb([...response.data]);
      console.log("saldo", response.data);
      setIsLoading(false);
    });
    setIsLoading(false);
  }, []);

  return (
    <div>
      <CCard>
        <CCardHeader>
          <div style={{ float: "right", width: "100%" }}>
            <div style={{ float: "left", position: "absolute" }}>
              <span>
                <strong>Data PIC TB</strong>
              </span>
            </div>
            <div style={{ float: "right" }}>
              <CButton size="sm" to="/pictb/create" color="primary">
                <i className="fa fa-plus"></i> <span>Tambah</span>
              </CButton>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          {isLoading === false ? (
            <Table data={pictb} />
          ) : (
            <center>
              <div style={{ height: "200px" }}>
                <BeatLoader color={"blue"} loading={true} size={20} />
              </div>
            </center>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default Manage;

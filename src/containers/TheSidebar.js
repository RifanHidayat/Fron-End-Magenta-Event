import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoProject } from "react-icons/go";
import { RiDashboardFill } from "react-icons/ri";
import { ImUserTie } from "react-icons/im";
import account from "./icons/account.svg";
import money from "./icons/money-flow.svg";
import { useHistory } from "react-router-dom";

import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CLabel,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

// sidebar nav config
import navigation from "./_nav";
let iconStyles = {
  color: "",
  fontSize: "1.5em",
  marginRight: "20px",
  right: "15px",
};

const TheSidebar = () => {
  const navigator = useHistory();

  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebarShow);

  const [nav, setNavavigation] = useState([]);

  useEffect(() => {
    const logout = () => {
      localStorage.clear();
      navigator.push("/login");

      //sessionStorage
    };

    const data = JSON.parse(localStorage.getItem("permission"));
    const DataNav = [];

    const dasboard = {
      _tag: "CSidebarNavItem",
      name: "Dashboard",
      to: "/dashboard",
      icon: <RiDashboardFill style={iconStyles} />,
    };
    const projectsAll = {
      _tag: "CSidebarNavDropdown",
      name: "  Projects",
      route: "/base",
      icon: <GoProject style={iconStyles} />,
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Manage Project",
          to: "/projects/manage",
        },
        {
          _tag: "CSidebarNavItem",
          name: "Mapping Project",
          to: "/mapping",
        },
      ],
    };
    const projectsManage = {
      _tag: "CSidebarNavDropdown",
      name: "  Projects",
      route: "/base",
      icon: <GoProject style={iconStyles} />,
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Manage Project",
          to: "/projects/manage",
        },
      ],
    };
    const accounts = {
      _tag: "CSidebarNavItem",
      name: "Akun",
      to: "/account/manage",
      icon: <img src={account} style={iconStyles}></img>,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // }
    };

    const pictb = {
      _tag: "CSidebarNavItem",
      name: "PIC TB",
      to: "/pictb/manage",
      icon: <ImUserTie style={iconStyles} />,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // }
    };
    const projectsMapping = {
      _tag: "CSidebarNavDropdown",
      name: "  Projects",
      route: "/base",
      icon: <GoProject style={iconStyles} />,
      _children: [
        {
          _tag: "CSidebarNavItem",
          name: "Mapping Project",
          to: "/mapping",
        },
      ],
    };

    const inout = {
      _tag: "CSidebarNavItem",
      name: "In Out",
      to: "/in-out",
      icon: <img src={money} style={iconStyles}></img>,
      // badge: {
      //   color: 'info',
      //   text: 'NEW',
      // }
    };
    DataNav.push(dasboard);
    let manage = 0;
    let mapping = 0;
    let navaccount = 0;
    let navinout = 0;
    let navpictb = 0;
    if (data !== null) {
      data.map((value) => {
        if (value === "inout") {
          // DataNav.push(inout);
          navinout = 1;
        }
        if (value == "account") {
          //  DataNav.push(account);
          navaccount = 1;
        }

        if (value === "pictb") {
          navpictb = 1;
        }
        if (value === "manage") {
          manage = 1;
        }

        if (value === "mapping") {
          mapping = 1;
        }
      });

      if (manage === 1 && mapping === 1) {
        DataNav.push(projectsAll);
      } else {
        if (mapping === 1) {
          DataNav.push(projectsMapping);
        } else if (manage === 1) {
          DataNav.push(projectsManage);
        }
      }

      if (navpictb === 1) {
        DataNav.push(pictb);
      }
      if (navinout === 1) {
        DataNav.push(inout);
      }
      if (navaccount === 1) {
        DataNav.push(accounts);
      }
    }

    //setNavavigation([...navigation]);
    setNavavigation([...DataNav]);
  }, []);

  return (
    <CSidebar
      show={show}
      className="c-sidebar c-sidebar-light"
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none bg-white text-left" to="/">
        <CLabel size="30px" className="c-sidebar-brand-full">
          <span className="text-dark">Magenta Finance</span>
        </CLabel>
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        /> */}

        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <CCreateElement
          items={nav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);

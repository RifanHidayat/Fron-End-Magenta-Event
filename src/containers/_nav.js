import React from "react";
import CIcon from "@coreui/icons-react";
import { GoProject } from "react-icons/go";
import { RiDashboardFill } from "react-icons/ri";
import { ImUserTie } from "react-icons/im";
import { GrMoney } from "react-icons/gr";
import account from "./icons/account.svg";
import money from "./icons/money-flow.svg";
let circleClasses = "inline-block p-7 rounded-full w-20 mx-auto";
let iconStyles = {
  color: "white",
  fontSize: "1.5em",
  marginRight: "20px",
  right: "15px",
};

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: <RiDashboardFill style={iconStyles} />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },

  {
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
  },
  {
    _tag: "CSidebarNavItem",
    name: "Akun",
    to: "/account/manage",
    icon: <img src={account} style={iconStyles}></img>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: "CSidebarNavItem",
    name: "PIC TB",
    to: "/pictb/manage",
    icon: <ImUserTie style={iconStyles} />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
  {
    _tag: "CSidebarNavItem",
    name: "In Out",
    to: "/in-out",
    icon: <img src={money} style={iconStyles}></img>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },
];

export default _nav;

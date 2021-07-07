import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },

  {
    _tag: 'CSidebarNavDropdown',
    name: 'Projects',
    route: '/base',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Manage Project',
        to: '/projects/manage',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Mapping Project',
        to: '/mapping',
      },
    

    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Akun',
    to: '/account/manage',
    icon: <CIcon name="cil-money" customClasses="c-sidebar-nav-icon"/>,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // }
  },

]

export default _nav

import React from 'react';

// const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
// const Tables = React.lazy(() => import('./views/base/tables/Tables'));

//Projects
const CreateProject = React.lazy(() => import('./views/base/events/Create'));
const ManageProject = React.lazy(() => import('./views/base/events/Manage'));
const EditProject = React.lazy(() => import('./views/base/events/Edit'));
const Mapping = React.lazy(() => import('./views/base/mapping-events/Manage'));
const LRProject = React.lazy(() => import('./views/base/mapping-events/LRProject'));
//const Menu = React.lazy(() => import('./views/base/mapping-events/Menu'));

//Mapping Event
const Members= React.lazy(() => import('./views/base/mapping-events/Members'));
const Budgets = React.lazy(() => import('./views/base/mapping-events/Budgets'));
const Approval = React.lazy(() => import('./views/base/mapping-events/Approval'));
const Tasks = React.lazy(() => import('./views/base/mapping-events/Tasks'));
const Transactions = React.lazy(() => import('./views/base/mapping-events/Transaction'));

//account
const ManageAccount = React.lazy(() => import('./views/base/account/Manage'));
const AddAccount = React.lazy(() => import('./views/base/account/Create'));
const EditAccount = React.lazy(() => import('./views/base/account/Edit'));
const DetailAccount = React.lazy(() => import('./views/base/account/Detail'));

//pic tb
const CreatePIC=React.lazy(()=>import('./views/base/tbpic/Create'))
const AddPIC=React.lazy(()=>import('./views/base/tbpic/Add'))
const ManagePIC=React.lazy(()=>import('./views/base/tbpic/Manage'))
const EditPIC=React.lazy(()=>import('./views/base/tbpic/Edit'))
const INTransaction = React.lazy(() => import('./views/base/tbpic/IN'));
const OUTTransaction = React.lazy(() => import('./views/base/tbpic/OUT'));
const TransactionPICTB = React.lazy(() => import('./views/base/tbpic/Transactions'));


const InOutTransaction = React.lazy(() => import('./views/base/inout/InOut'));



const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));

const Login = React.lazy(() => import('./views/pages/login/Login'));





// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/base/cards/Cards'));
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
// const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

// const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
//  const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
// // const Navs = React.lazy(() => import('./views/base/navs/Navs'));
// // const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
// // const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
// // const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
// // const Switches = React.lazy(() => import('./views/base/switches/Switches'));

// // const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
// // const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
// // const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
// // const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
// // const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
// // const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
// // const Charts = React.lazy(() => import('./views/charts/Charts'));
//  const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
// // const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
// // const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
// // const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
// // const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
// // const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
// // const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
// // const Users = React.lazy(() => import('./views/users/Users'));
// const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  //projects
  { path: '/projects/create', name: 'Projects / Create', component: CreateProject },
  { path: '/projects/manage', name: 'Projects / Manage', component: ManageProject },
  { path: '/projects/edit/:id', name: 'Edit', component: EditProject },  
  
  //mapping projects
  { path: '/mapping', name: 'Projects / Mapping', component: Mapping ,exact: true},
  { path: '/mapping/budgets/:id', name: 'Budgets', component: Budgets },
  { path: '/mapping/tasks/:id', name: 'Tasks', component: Tasks },
  { path: '/mapping/approval/:id', name: 'Approval', component: Approval },
  { path: '/mapping/members/:id', name: 'Members', component: Members },
  { path: '/mapping/transactions/:id/:project_number', name: 'Transactions', component:Transactions },
  { path: '/mapping/profit-cost/:id', name: 'Profit-cost', component:LRProject },

  //account
  { path: '/account/manage', name: 'Account / Manage', component: ManageAccount },
  { path: '/account/create', name: 'Account / Create', component: AddAccount },
  { path: '/account/edit/:id', name: 'Account / Edit', component: EditAccount },
  { path: '/account/detail/:id', name: 'Account / Detail', component: DetailAccount },

  //pic tb
  { path: '/pictb/create', name: 'PICTB / Create', component: CreatePIC },
  { path: '/pictb/add/:id', name: 'PICTB / Add', component: AddPIC },
  { path: '/pictb/manage', name: 'PICTB / Manage', component: ManagePIC },
  { path: '/pictb/edit/:id', name: 'PICTB / Edit', component: EditPIC },
  { path: '/pictb/in-transaction/:id', name: 'PICTB / In Transaction', component: INTransaction },
  { path: '/pictb/out-transaction/:id', name: 'PICTB / Out Transaction', component: OUTTransaction },
  { path: '/pictb/transaction-pictb/:id', name: 'PICTB / Transactions PICTB', component: TransactionPICTB },
  
  { path: '/in-out', name: 'In-Out', component:InOutTransaction },

  { path: '/login', name: 'In-Out', component:Login },



  

  // { path: '/theme', name: 'Theme', component: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', component: Colors },
  // { path: '/theme/typography', name: 'Typography', component: Typography },
  // { path: '/base', name: 'Base', component: Cards, exact: true },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', component: Cards },
  // { path: '/base/carousels', name: 'Carousel', component: Carousels },
  // { path: '/base/collapses', name: 'Collapse', component: Collapses },
  // { path: '/base/forms', name: 'Forms', component: BasicForms },
  // { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  // { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
 //  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  // { path: '/base/navs', name: 'Navs', component: Navs },
  // { path: '/base/paginations', name: 'Paginations', component: Paginations },
  // { path: '/base/popovers', name: 'Popovers', component: Popovers },
  // { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  // { path: '/base/switches', name: 'Switches', component: Switches },
  // { path: '/base/tables', name: 'Tables', component: Tables },
  // { path: '/base/tabs', name: 'Tabs', component: Tabs },
  // { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  // { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  // { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  // { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  // { path: '/charts', name: 'Charts', component: Charts },
  // { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', component: Flags },
  // { path: '/icons/brands', name: 'Brands', component: Brands },
   //{ path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', component: ManageProject },
  // { path: '/notifications/badges', name: 'Badges', component: Badges },
  // { path: '/notifications/modals', name: 'Modals', component: Modals },
  // { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  // { path: '/widgets', name: 'Widgets', component: Widgets },
  // { path: '/users', exact: true,  name: 'Users', component: Users },
  // { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;

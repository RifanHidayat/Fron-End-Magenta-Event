import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "src/views/base/components/FilterComponent";

var dateformat=require('dateformat')
const Transactions = props => {
  const columns = [  
    {
      name: 'Tanggal',
      sortable: true,    
      cell: row => <div  data-tag="allowRowEvents"><div >{dateformat(row.date,'dd/mm/yyyy')}</div></div>, 
    }, 
  
    {
      name: 'Deskripsi',
      sortable: true,   
      cell: row => 
      <div data-tag="allowRowEvents"><div >{row.description}</div></div>,  
    }, 
  
    {
      name: 'Cash In',
      sortable: true,
      right:true,
      cell: row => 
        <span>
          {row.type==="in"?
          'IDR '+row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          :""}
        </span>
    },
  
    {
      name: 'Cash Out',
      sortable: true,
      right:true,    
      cell: row => 
        <span>
          {row.type==="out"?
          'IDR '+row.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          :""}
        </span>
    }, 
  
    {
      name: 'Margin',
      sortable: true,
      right:true,    
      cell: row => "IDR "+row.balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
    },
  
    {
      name: '%',
      sortable: true, 
      center:true,   
      cell: row => <div data-tag="allowRowEvents"><div >{row.persentase+'%'}</div></div>,
    }, 
  
    
  ];
  
    
    


  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
    false
  );


  const filteredItems = props.data.filter(
    item =>
      JSON.stringify(item)
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
  );


  const subHeaderComponent = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };


    return (
      <FilterComponent
        onFilter={e => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <DataTable
     
      columns={columns}
      data={filteredItems}
      defaultSortField="name"
      pagination
      subHeader
      subHeaderComponent={subHeaderComponent}
    
    />
  );
};

export default Transactions;




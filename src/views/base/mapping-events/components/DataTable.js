import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "src/views/base/components/FilterComponent";


const Table = props => {
    const columns = [  
        {
          name: 'No. quotation',
          sortable: true,    
          cell: row => <div  data-tag="allowRowEvents"><div >{row.quotation_number}</div></div>, 
        }, 
      
        {
          name: 'tanggal quotation',
          sortable: true,   
          cell: row => 
          <div data-tag="allowRowEvents"><div >{row.date_quotation}</div></div>,  
        }, 
      
        {
          name: 'No. PO',sortable: true,
          cell: row => <div data-tag="allowRowEvents"><div >{row.po_number}</div></div>,
        },
      
        {
          name: 'Tanggal PO',
          sortable: true,    
          cell: row => <div data-tag="allowRowEvents"><div >{row.date_po_number}</div></div>,
        }, 
      
        {
          name: 'Customer',
          sortable: true,    
          cell: row => <div data-tag="allowRowEvents"><div >{row.customer_event}</div></div>, 
        },
      
        {
          name: 'PIC Event',
          sortable: true,    
          cell: row => <div data-tag="allowRowEvents"><div >{row.pic_event}</div></div>,
        }, 
      
        {
          name: 'Total Biaya',
          sortable: true,
          right: true,   
          cell: row => <div data-tag="allowRowEvents"><div >{row.grand_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          }</div></div>,  
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

export default Table;

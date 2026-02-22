import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  Column,
  usePagination,
  useSortBy,
  useTable,
  TableOptions,
} from "react-table";

function TableHOC<T extends Object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      pageCount,
      state: { pageIndex },
      previousPage,
      canNextPage,
      canPreviousPage,
    } = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        {/* extract key from props objects returned by react-table helpers */}
        {(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tableProps = getTableProps() as any;
          const { key: tableKey, ...tableRest } = tableProps;

          return (
            <table key={tableKey} className="table" {...tableRest}>
              <thead>
                {headerGroups.map((headerGroup) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const hgProps = headerGroup.getHeaderGroupProps() as any;
                  const { key: hgKey, ...hgRest } = hgProps;

                  return (
                    <tr key={hgKey} {...hgRest}>
                      {headerGroup.headers.map((column) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const colProps = column.getHeaderProps(
                          column.getSortByToggleProps()
                        ) as any;
                        const { key: colKey, ...colRest } = colProps;

                        return (
                          <th key={colKey} {...colRest}>
                            {column.render("Header")}
                            {column.isSorted && (
                              <span>
                                {" "}
                                {column.isSortedDesc ? (
                                  <AiOutlineSortDescending />
                                ) : (
                                  <AiOutlineSortAscending />
                                )}
                              </span>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              {(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tBodyProps = getTableBodyProps() as any;
                const { key: tbKey, ...tbRest } = tBodyProps;

                return (
                  <tbody key={tbKey} {...tbRest}>
                    {page.map((row) => {
                      prepareRow(row);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const rowProps = row.getRowProps() as any;
                      const { key: rowKey, ...rowRest } = rowProps;

                      return (
                        <tr key={rowKey} {...rowRest}>
                          {row.cells.map((cell) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const cellProps = cell.getCellProps() as any;
                            const { key: cellKey, ...cellRest } = cellProps;

                            return (
                              <td key={cellKey} {...cellRest}>
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                );
              })()}
            </table>
          );
        })()}

        {showPagination && (
          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;

// ...existing code...
// import {
//   AiOutlineSortAscending,
//   AiOutlineSortDescending,
// } from "react-icons/ai";
// import {
//   Column,
//   usePagination,
//   useSortBy,
//   useTable,
//   TableOptions,
// } from "react-table";

// function TableHOC<T extends Object>(
//   columns: Column<T>[],
//   data: T[],
//   containerClassname: string,
//   heading: string,
//   showPagination: boolean = false
// ) {
//   return function HOC() {
//     const options: TableOptions<T> = {
//       columns,
//       data,
//       initialState: {
//         pageSize: 6,
//       },
//     };

//     const {
//       getTableProps,
//       getTableBodyProps,
//       headerGroups,
//       page,
//       prepareRow,
//       nextPage,
//       pageCount,
//       state: { pageIndex },
//       previousPage,
//       canNextPage,
//       canPreviousPage,
//     } = useTable(options, useSortBy, usePagination);

//     return (
//       <div className={containerClassname}>
//         <h2 className="heading">{heading}</h2>

//         <table className="table" {...getTableProps()}>
//           <thead>
//             {headerGroups.map((headerGroup) => {
//               const hgProps = headerGroup.getHeaderGroupProps() as any;
//               const { key: hgKey, ...hgRest } = hgProps;
//               return (
//                 <tr key={hgKey} {...hgRest}>
//                   {headerGroup.headers.map((column) => {
//                     const colProps = column.getHeaderProps(
//                       column.getSortByToggleProps()
//                     ) as any;
//                     const { key: colKey, ...colRest } = colProps;
//                     return (
//                       <th key={colKey} {...colRest}>
//                         {column.render("Header")}
//                         {column.isSorted && (
//                           <span>
//                             {" "}
//                             {column.isSortedDesc ? (
//                               <AiOutlineSortDescending />
//                             ) : (
//                               <AiOutlineSortAscending />
//                             )}
//                           </span>
//                         )}
//                       </th>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </thead>
//           <tbody {...getTableBodyProps()}>
//             {page.map((row) => {
//               prepareRow(row);
//               const rowProps = row.getRowProps() as any;
//               const { key: rowKey, ...rowRest } = rowProps;

//               return (
//                 <tr key={rowKey} {...rowRest}>
//                   {row.cells.map((cell) => {
//                     const cellProps = cell.getCellProps() as any;
//                     const { key: cellKey, ...cellRest } = cellProps;
//                     return (
//                       <td key={cellKey} {...cellRest}>
//                         {cell.render("Cell")}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {showPagination && (
//           <div className="table-pagination">
//             <button disabled={!canPreviousPage} onClick={previousPage}>
//               Prev
//             </button>
//             <span>{`${pageIndex + 1} of ${pageCount}`}</span>
//             <button disabled={!canNextPage} onClick={nextPage}>
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };
// }

// export default TableHOC;

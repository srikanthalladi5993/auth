import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'

function DataTable({ tableRows, columns }) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const rowsPerPage = 6

  const filteredRows = useMemo(() => {
    const searchTerm = query.toLowerCase()
    return tableRows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(searchTerm)),
    )
  }, [query, tableRows])

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows
    const sorted = [...filteredRows]
    sorted.sort((a, b) => {
      const left = a[sortKey]
      const right = b[sortKey]
      if (left < right) return sortOrder === 'asc' ? -1 : 1
      if (left > right) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredRows, sortKey, sortOrder])

  const pagedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return sortedRows.slice(start, start + rowsPerPage)
  }, [sortedRows, page])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage))

  const handleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key)
      setSortOrder('asc')
      return
    }
    if (sortOrder === 'asc') {
      setSortOrder('desc')
      return
    }
    setSortKey(null)
    setSortOrder('asc')
  }

  const getSortIcon = (colKey) => {
    if (sortKey !== colKey) return <ArrowUpDown size={14} />
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={16} /></span>
          <input
            className="search-input"
            placeholder="Search records"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="sort-cell-wrap">
          <span className="sort-cell">Sorted by: {sortKey || 'Default'}</span>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                onClick={() => handleSort(col)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {getSortIcon(col)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            disabled={p === page}
            aria-current={p === page}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default DataTable

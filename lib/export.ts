import type { Table } from '@tanstack/vue-table'

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | 'select' | 'actions')[]

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean
  } = {},
): void {
  const {
    filename = 'table',
    excludeColumns = [],
    onlySelected = false,
  } = opts

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map(column => column.id)
    .filter(
      id => !excludeColumns.includes(id as keyof TData | 'select' | 'actions'),
    )

  // Build CSV content
  const csvContent = [
    headers.join(','), // Add column headers as the first row
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map(row =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header)

          // Handle complex objects or non-string values
          if (typeof cellValue === 'object' && cellValue !== null) {
            return `"${JSON.stringify(cellValue).replace(/"/g, '""')}"`
          }

          // Handle strings and escape quotes
          if (typeof cellValue === 'string') {
            return `"${cellValue.replace(/"/g, '""')}"`
          }

          // Return other primitive values as-is
          return cellValue ?? ''
        })
        .join(','), // Join each cell value into a CSV row
    ),
  ].join('\n')

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

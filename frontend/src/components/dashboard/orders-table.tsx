"use client"

import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  tableFeatures,
  useTable,
  type Column,
} from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ListFilterIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  currency,
  orderStatuses,
  shortDate,
  type Order,
  type OrderStatus,
} from "@/lib/dashboard-data"

// Fonctionnalités de la table (TanStack Table v9), déclarées une fois hors du composant.
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic },
  filterFns: { includesString: filterFn_includesString },
})

const statusVariant: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  payée: "default",
  expédiée: "secondary",
  "en attente": "outline",
  remboursée: "destructive",
}

// "payée" -> "Payée" (capitalize mettrait une majuscule à chaque mot : "En Attente").
const statusLabel = (status: OrderStatus) => status.charAt(0).toUpperCase() + status.slice(1)

const columnHelper = createColumnHelper<typeof features, Order>()

function SortButton<TValue>({
  column,
  label,
}: {
  column: Column<typeof features, Order, TValue>
  label: string
}) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon
  return (
    <Button variant="ghost" size="sm" className="-ml-3" onClick={column.getToggleSortingHandler()}>
      {label}
      <Icon data-icon="inline-end" />
    </Button>
  )
}

const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Commande",
    enableGlobalFilter: true,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("customer", {
    header: ({ column }) => <SortButton column={column} label="Client" />,
    sortFn: "alphanumeric",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  }),
  columnHelper.accessor("date", {
    header: ({ column }) => <SortButton column={column} label="Date" />,
    sortFn: "alphanumeric", // ISO 8601 : l'ordre alphabétique est l'ordre chronologique
    enableGlobalFilter: false,
    cell: (info) => shortDate.format(new Date(info.getValue())),
  }),
  columnHelper.accessor("status", {
    header: "Statut",
    // Le statut est une chaîne : on garde la ligne si elle fait partie des statuts cochés.
    // (arrIncludesSome attend une valeur de ligne qui soit elle-même un tableau.)
    filterFn: (row, columnId, selected: OrderStatus[]) =>
      selected.includes(row.getValue<OrderStatus>(columnId)),
    enableGlobalFilter: false,
    cell: (info) => (
      <Badge variant={statusVariant[info.getValue()]}>{statusLabel(info.getValue())}</Badge>
    ),
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <div className="flex justify-end">
        <SortButton column={column} label="Montant" />
      </div>
    ),
    sortFn: "basic",
    enableGlobalFilter: false,
    cell: (info) => (
      <div className="text-right tabular-nums">{currency.format(info.getValue())}</div>
    ),
  }),
])

export function OrdersTable({ data }: { data: Order[] }) {
  const table = useTable({
    features,
    columns,
    data,
    globalFilterFn: "includesString",
    initialState: {
      sorting: [{ id: "date", desc: true }],
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  })

  const statusColumn = table.getColumn("status")
  const selectedStatuses = (statusColumn?.getFilterValue() as OrderStatus[] | undefined) ?? []
  const filteredCount = table.getFilteredRowModel().rows.length
  const { pageIndex } = table.state.pagination
  const pageCount = table.getPageCount()

  function toggleStatus(status: OrderStatus, checked: boolean) {
    const next = checked
      ? [...selectedStatuses, status]
      : selectedStatuses.filter((s) => s !== status)
    statusColumn?.setFilterValue(next.length ? next : undefined)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes récentes</CardTitle>
        <CardDescription>Recherche, tri par colonne et filtre par statut.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Rechercher un client ou une commande…"
            aria-label="Rechercher un client ou une commande"
            value={(table.state.globalFilter as string | undefined) ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="sm:max-w-xs"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="sm:ml-auto">
                <ListFilterIcon data-icon="inline-start" />
                Statut
                {selectedStatuses.length > 0 && (
                  <Badge variant="secondary">{selectedStatuses.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {orderStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={selectedStatuses.includes(status)}
                    onCheckedChange={(checked) => toggleStatus(status, checked === true)}
                  >
                    {statusLabel(status)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    Aucune commande ne correspond à ces critères.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredCount} commande{filteredCount > 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
            Page {pageCount ? pageIndex + 1 : 0} sur {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!pageCount || !table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

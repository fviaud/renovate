// Données d'exemple du tableau de bord, à remplacer par une vraie source (API, base de données).

export const orderStatuses = ["payée", "expédiée", "en attente", "remboursée"] as const

export type OrderStatus = (typeof orderStatuses)[number]

export type Order = {
  id: string
  customer: string
  email: string
  date: string // ISO 8601
  status: OrderStatus
  amount: number // en euros
}

export const orders: Order[] = [
  { id: "CMD-1048", customer: "Camille Martin", email: "camille.martin@example.com", date: "2026-11-25", status: "payée", amount: 249.9 },
  { id: "CMD-1047", customer: "Lucas Bernard", email: "lucas.bernard@example.com", date: "2026-11-25", status: "en attente", amount: 89.0 },
  { id: "CMD-1046", customer: "Léa Dubois", email: "lea.dubois@example.com", date: "2026-11-24", status: "expédiée", amount: 412.5 },
  { id: "CMD-1045", customer: "Hugo Thomas", email: "hugo.thomas@example.com", date: "2026-11-24", status: "payée", amount: 59.99 },
  { id: "CMD-1044", customer: "Chloé Robert", email: "chloe.robert@example.com", date: "2026-11-23", status: "remboursée", amount: 129.0 },
  { id: "CMD-1043", customer: "Louis Richard", email: "louis.richard@example.com", date: "2026-11-23", status: "expédiée", amount: 315.2 },
  { id: "CMD-1042", customer: "Emma Petit", email: "emma.petit@example.com", date: "2026-11-22", status: "payée", amount: 78.4 },
  { id: "CMD-1041", customer: "Gabriel Durand", email: "gabriel.durand@example.com", date: "2026-11-22", status: "en attente", amount: 540.0 },
  { id: "CMD-1040", customer: "Manon Leroy", email: "manon.leroy@example.com", date: "2026-11-21", status: "expédiée", amount: 199.0 },
  { id: "CMD-1039", customer: "Jules Moreau", email: "jules.moreau@example.com", date: "2026-11-21", status: "payée", amount: 64.5 },
  { id: "CMD-1038", customer: "Inès Simon", email: "ines.simon@example.com", date: "2026-11-20", status: "payée", amount: 289.9 },
  { id: "CMD-1037", customer: "Arthur Laurent", email: "arthur.laurent@example.com", date: "2026-11-20", status: "remboursée", amount: 45.0 },
  { id: "CMD-1036", customer: "Jade Lefebvre", email: "jade.lefebvre@example.com", date: "2026-11-19", status: "expédiée", amount: 158.75 },
  { id: "CMD-1035", customer: "Raphaël Michel", email: "raphael.michel@example.com", date: "2026-11-19", status: "payée", amount: 99.0 },
  { id: "CMD-1034", customer: "Louise Garcia", email: "louise.garcia@example.com", date: "2026-11-18", status: "en attente", amount: 372.3 },
  { id: "CMD-1033", customer: "Adam David", email: "adam.david@example.com", date: "2026-11-18", status: "payée", amount: 27.9 },
  { id: "CMD-1032", customer: "Alice Bertrand", email: "alice.bertrand@example.com", date: "2026-11-17", status: "expédiée", amount: 612.0 },
  { id: "CMD-1031", customer: "Nathan Roux", email: "nathan.roux@example.com", date: "2026-11-17", status: "payée", amount: 134.6 },
  { id: "CMD-1030", customer: "Rose Vincent", email: "rose.vincent@example.com", date: "2026-11-16", status: "payée", amount: 82.0 },
  { id: "CMD-1029", customer: "Tom Fournier", email: "tom.fournier@example.com", date: "2026-11-16", status: "remboursée", amount: 210.0 },
  { id: "CMD-1028", customer: "Lina Morel", email: "lina.morel@example.com", date: "2026-11-15", status: "expédiée", amount: 95.5 },
  { id: "CMD-1027", customer: "Paul Girard", email: "paul.girard@example.com", date: "2026-11-15", status: "payée", amount: 447.0 },
  { id: "CMD-1026", customer: "Anna André", email: "anna.andre@example.com", date: "2026-11-14", status: "en attente", amount: 66.0 },
  { id: "CMD-1025", customer: "Victor Mercier", email: "victor.mercier@example.com", date: "2026-11-14", status: "payée", amount: 189.9 },
]

// Valeurs de la période précédente, pour calculer les tendances des cartes.
export const previousPeriod = {
  revenue: 4620,
  orders: 21,
  averageOrder: 220,
  refundRate: 0.143,
}

export function getStats(list: Order[] = orders) {
  const kept = list.filter((o) => o.status !== "remboursée")
  const revenue = kept.reduce((sum, o) => sum + o.amount, 0)
  const refunded = list.length - kept.length
  return {
    revenue,
    orders: list.length,
    averageOrder: kept.length ? revenue / kept.length : 0,
    refundRate: list.length ? refunded / list.length : 0,
  }
}

export const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })

export const percent = new Intl.NumberFormat("fr-FR", { style: "percent", maximumFractionDigits: 1 })

// timeZone UTC : même rendu côté serveur et côté navigateur.
export const shortDate = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "UTC" })

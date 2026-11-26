import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currency, getStats, percent, previousPeriod } from "@/lib/dashboard-data"

type Stat = {
  label: string
  value: string
  change: number // variation relative par rapport à la période précédente
  upIsGood: boolean
  footer: string
}

function buildStats(): Stat[] {
  const s = getStats()
  const p = previousPeriod
  return [
    {
      label: "Chiffre d'affaires",
      value: currency.format(s.revenue),
      change: (s.revenue - p.revenue) / p.revenue,
      upIsGood: true,
      footer: "Hors commandes remboursées",
    },
    {
      label: "Commandes",
      value: String(s.orders),
      change: (s.orders - p.orders) / p.orders,
      upIsGood: true,
      footer: "Sur les 12 derniers jours",
    },
    {
      label: "Panier moyen",
      value: currency.format(s.averageOrder),
      change: (s.averageOrder - p.averageOrder) / p.averageOrder,
      upIsGood: true,
      footer: "Montant moyen par commande",
    },
    {
      label: "Remboursements",
      value: percent.format(s.refundRate),
      change: (s.refundRate - p.refundRate) / p.refundRate,
      upIsGood: false,
      footer: "Part des commandes remboursées",
    },
  ]
}

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {buildStats().map((stat) => {
        const up = stat.change >= 0
        const good = up === stat.upIsGood
        const TrendIcon = up ? TrendingUpIcon : TrendingDownIcon
        return (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{stat.value}</CardTitle>
              <CardAction>
                <Badge variant={good ? "secondary" : "destructive"}>
                  <TrendIcon />
                  {up ? "+" : ""}
                  {percent.format(stat.change)}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="text-sm text-muted-foreground">
              {stat.footer}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

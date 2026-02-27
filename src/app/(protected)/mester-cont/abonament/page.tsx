import { getMesterProfile } from "@/actions/mester"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { SUBSCRIPTION_TIERS } from "@/lib/constants"
import type { SubscriptionTier } from "@/types/database"

const plans = [
  {
    tier: "ucenic" as SubscriptionTier,
    name: "Ucenic",
    price: "Gratuit",
    description: "Pentru începători",
    features: [
      "Profil de bază",
      "Până la 5 fotografii",
      "Poziție standard în rezultate",
    ],
  },
  {
    tier: "mester" as SubscriptionTier,
    name: "Meșter",
    price: "49 lei/lună",
    description: "Pentru profesioniști",
    features: [
      "Profil complet",
      "Până la 15 fotografii",
      "Poziție preferențială",
      "Badge Meșter",
    ],
  },
  {
    tier: "master" as SubscriptionTier,
    name: "Master",
    price: "99 lei/lună",
    description: "Pentru experți",
    popular: true,
    features: [
      "Toate beneficiile Meșter",
      "Fotografii nelimitate",
      "Poziție top în rezultate",
      "Badge Master auriu",
      "Notificări prioritare pentru cereri",
    ],
  },
  {
    tier: "premium" as SubscriptionTier,
    name: "Premium",
    price: "199 lei/lună",
    description: "Vizibilitate maximă",
    features: [
      "Toate beneficiile Master",
      "Prima poziție în listă",
      "Badge Premium violet",
      "Afișare pe pagina principală",
      "Suport prioritar",
    ],
  },
]

export default async function SubscriptionPage() {
  const mester = await getMesterProfile()
  const currentTier = mester?.subscription_tier as SubscriptionTier || "ucenic"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Abonament</h1>
        <p className="text-muted-foreground">
          Alege planul potrivit pentru afacerea ta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abonamentul tău curent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={currentTier} className="text-lg px-4 py-1">
              {SUBSCRIPTION_TIERS[currentTier].label}
            </Badge>
            <p className="text-muted-foreground">
              {currentTier === "ucenic"
                ? "Planul gratuit de bază"
                : "Plan activ"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrentPlan = plan.tier === currentTier
          const tierConfig = SUBSCRIPTION_TIERS[plan.tier]

          return (
            <Card
              key={plan.tier}
              className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <Badge variant={plan.tier} className="w-fit mb-2">
                  {plan.name}
                </Badge>
                <CardTitle className="text-2xl">{plan.price}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Plan curent" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">
            Plățile sunt procesate securizat. Poți anula abonamentul oricând.
            <br />
            Pentru întrebări, contactează-ne la{" "}
            <a href="mailto:contact@mesteritulcea.ro" className="text-primary">
              contact@mesteritulcea.ro
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

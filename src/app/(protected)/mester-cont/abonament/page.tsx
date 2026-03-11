import { getMesterProfile } from "@/actions/mester"
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
    price: "49 lei",
    period: "/ lună",
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
    price: "99 lei",
    period: "/ lună",
    description: "Pentru experți",
    popular: true,
    features: [
      "Toate beneficiile Meșter",
      "Fotografii nelimitate",
      "Poziție top în rezultate",
      "Badge Master auriu",
      "Notificări prioritare",
    ],
  },
  {
    tier: "premium" as SubscriptionTier,
    name: "Premium",
    price: "199 lei",
    period: "/ lună",
    description: "Vizibilitate maximă",
    features: [
      "Toate beneficiile Master",
      "Prima poziție în listă",
      "Badge Premium",
      "Afișare pe pagina principală",
      "Suport prioritar",
    ],
  },
]

export default async function SubscriptionPage() {
  const mester      = await getMesterProfile()
  const currentTier = (mester?.subscription_tier as SubscriptionTier) || "ucenic"

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
          Panou meșter
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Abonament
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Alege planul potrivit pentru afacerea ta
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-8">

        {/* Current plan */}
        <div
          className="flex items-center gap-4 px-6 py-5"
          style={{
            background: "#faf6ed",
            border: "1px solid #e0c99a",
            borderRadius: "6px",
          }}
        >
          <div>
            <p className="font-condensed tracking-[0.16em] uppercase text-xs text-[#8a6848] mb-2">
              Abonamentul tău curent
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5"
              style={{
                border: "1px solid hsl(38 68% 44% / 0.5)",
                background: "hsl(38 68% 44% / 0.1)",
                borderRadius: "4px",
              }}
            >
              <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-primary">
                {SUBSCRIPTION_TIERS[currentTier].label}
              </span>
            </div>
          </div>
          <p className="text-sm text-[#8a6848] ml-2">
            {currentTier === "ucenic" ? "Planul gratuit de bază" : "Plan activ"}
          </p>
        </div>

        {/* Plans grid */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Planuri disponibile
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {plans.map((plan) => {
              const isCurrentPlan = plan.tier === currentTier

              return (
                <div
                  key={plan.tier}
                  className="flex flex-col relative"
                  style={{
                    background: "white",
                    border: plan.popular
                      ? "1px solid hsl(38 68% 44% / 0.6)"
                      : "1px solid #e0c99a",
                    borderRadius: "6px",
                    ...(isCurrentPlan ? { background: "#faf6ed" } : {}),
                  }}
                >
                  {plan.popular && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1"
                      style={{
                        background: "white",
                        border: "1px solid hsl(38 68% 44% / 0.6)",
                        borderRadius: "4px",
                      }}
                    >
                      <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-primary font-semibold">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="px-5 pt-7 pb-5" style={{ borderBottom: "1px solid #e0c99a" }}>
                    <p className="font-condensed tracking-[0.2em] uppercase text-xs text-[#8a6848] mb-3">
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1 mb-1.5">
                      <span
                        className="font-display text-[#1a0f05] font-semibold"
                        style={{ fontSize: "clamp(22px, 3vw, 30px)", lineHeight: 1 }}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-[#8a6848]">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#8a6848]">{plan.description}</p>
                  </div>

                  {/* Features + CTA */}
                  <div className="px-5 py-5 flex-1 flex flex-col">
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="h-3.5 w-3.5 text-primary/65 mt-0.5 shrink-0" />
                          <span className="text-sm text-[#3d2810] leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={isCurrentPlan}
                      className="w-full h-10 font-condensed tracking-[0.16em] uppercase text-sm font-semibold transition-all duration-200 disabled:cursor-default"
                      style={
                        isCurrentPlan
                          ? {
                              border: "1px solid #e0c99a",
                              color: "hsl(38 68% 44% / 0.7)",
                              background: "hsl(38 68% 44% / 0.08)",
                              borderRadius: "4px",
                            }
                          : {
                              border: "1px solid hsl(38 68% 44% / 0.5)",
                              color: "hsl(38 68% 44%)",
                              background: "transparent",
                              borderRadius: "4px",
                            }
                      }
                    >
                      {isCurrentPlan ? "Plan curent" : "Upgrade"}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Note */}
        <div
          className="px-5 py-4 text-center"
          style={{ background: "#faf6ed", border: "1px solid #e0c99a", borderRadius: "6px" }}
        >
          <p className="text-sm text-[#8a6848] leading-relaxed">
            Plățile sunt procesate securizat. Poți anula oricând.{" "}
            <br className="hidden sm:block" />
            Întrebări:{" "}
            <a
              href="mailto:contact@mesteritulcea.ro"
              className="text-primary/65 hover:text-primary transition-colors duration-200"
            >
              contact@mesteritulcea.ro
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}

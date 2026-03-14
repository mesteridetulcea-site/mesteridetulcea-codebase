import { getMesterProfile } from "@/actions/mester"
import { Check } from "lucide-react"

const plans = [
  {
    tier: "standard",
    name: "Standard",
    price: "Gratuit",
    description: "Profil de bază pentru a fi găsit de clienți",
    features: [
      "Profil public vizibil",
      "Până la 5 fotografii",
      "Poziție standard în rezultate",
    ],
  },
  {
    tier: "premium",
    name: "Premium",
    price: "99 lei",
    period: "/ lună",
    description: "Vizibilitate maximă și mai mulți clienți",
    features: [
      "Fotografii nelimitate",
      "Prima poziție în rezultate",
      "Badge Premium vizibil",
      "Afișare pe pagina principală",
      "Notificări prioritare",
      "Suport prioritar",
    ],
  },
]

export default async function SubscriptionPage() {
  const mester    = await getMesterProfile()
  const isPremium = mester?.subscription_tier === "premium"
  const currentTier = isPremium ? "premium" : "standard"

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
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
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
          <div className="flex items-center gap-2 pb-1">
            <span className="font-condensed tracking-[0.14em] uppercase text-xs text-[#8a6848]">
              Plan curent:
            </span>
            <div
              className="inline-flex items-center px-3 py-1"
              style={{
                border: "1px solid hsl(38 68% 44% / 0.5)",
                background: "hsl(38 68% 44% / 0.1)",
                borderRadius: "4px",
              }}
            >
              <span className="font-condensed tracking-[0.18em] uppercase text-sm font-semibold text-primary">
                {isPremium ? "Premium" : "Standard"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-8">

        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const isCurrentPlan = plan.tier === currentTier

            return (
              <div
                key={plan.tier}
                className="flex flex-col relative"
                style={{
                  background: isCurrentPlan ? "#faf6ed" : "white",
                  border: plan.tier === "premium"
                    ? "1px solid hsl(38 68% 44% / 0.6)"
                    : "1px solid #e0c99a",
                  borderRadius: "6px",
                }}
              >
                {/* Plan header */}
                <div className="px-7 pt-8 pb-6" style={{ borderBottom: "1px solid #e0c99a" }}>
                  <p className="font-condensed tracking-[0.2em] uppercase text-xs text-[#8a6848] mb-4">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span
                      className="font-display text-[#1a0f05] font-semibold"
                      style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1 }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-[#8a6848]">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-[#8a6848]">{plan.description}</p>
                </div>

                {/* Features + CTA */}
                <div className="px-7 py-7 flex-1 flex flex-col">
                  <ul className="space-y-3.5 flex-1 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary/65 mt-0.5 shrink-0" />
                        <span className="text-sm text-[#3d2810] leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <button
                      disabled
                      className="w-full h-11 font-condensed tracking-[0.16em] uppercase text-sm font-semibold cursor-default"
                      style={{
                        border: "1px solid #e0c99a",
                        color: "hsl(38 68% 44% / 0.7)",
                        background: "hsl(38 68% 44% / 0.08)",
                        borderRadius: "4px",
                      }}
                    >
                      Plan curent
                    </button>
                  ) : isPremium && plan.tier === "standard" ? null : (
                    <button
                      className="w-full h-11 font-condensed tracking-[0.16em] uppercase text-sm font-semibold transition-all duration-200"
                      style={{
                        border: "1px solid hsl(38 68% 44% / 0.5)",
                        color: "hsl(38 68% 44%)",
                        background: "transparent",
                        borderRadius: "4px",
                      }}
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <p className="text-sm text-[#8a6848] text-center leading-relaxed">
          Plățile sunt procesate securizat. Poți anula oricând.{" "}
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
  )
}

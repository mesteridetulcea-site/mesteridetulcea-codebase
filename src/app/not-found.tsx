import Link from "next/link"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-bold bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">
            404
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-4">Pagină negăsită</h1>
        <p className="text-muted-foreground mb-8">
          Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Acasă
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/mesteri">
              <Search className="h-4 w-4 mr-2" />
              Caută meșteri
            </Link>
          </Button>
        </div>
        <div className="mt-8">
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Înapoi la pagina anterioară
          </Link>
        </div>
      </div>
    </div>
  )
}

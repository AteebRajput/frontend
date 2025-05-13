import { Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/product-ui/Card"
import { Badge } from "../ui/Badge"
import { useTranslation } from "react-i18next"

export default function LogisticsPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-black mb-8">{t("pakistanLogistics")}</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        {t("tagline")}
      </p>

      <div className="grid grid-cols-1 gap-8">
        {/* TCS */}
        <Card className="overflow-hidden border-t-4 border-t-red-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-red-600">{t("tcs")}</CardTitle>
                <CardDescription>{t("premiumCourier")}</CardDescription>
              </div>
              <Badge className="bg-red-600 text-white">{t("premiumServices")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{t("tcsAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span>{t("tcsPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <a href="mailto:customerservices@tcs.com.pk" className="text-blue-600 hover:underline">
                    {t("tcsEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://www.tcs.com.pk/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("tcsWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LEOPARD */}
        <Card className="overflow-hidden border-t-4 border-t-yellow-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-yellow-600">{t("leopard")}</CardTitle>
                <CardDescription>{t("leopardTagline")}</CardDescription>
              </div>
              <Badge className="bg-yellow-600 text-white">{t("expressDelivery")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{t("leopardAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <span>{t("leopardPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <a href="mailto:customerservice@leopardscourier.com" className="text-blue-600 hover:underline">
                    {t("leopardEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://www.leopardscourier.com/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("leopardWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daewoo Fastex */}
        <Card className="overflow-hidden border-t-4 border-t-blue-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-blue-600">{t("daewoo")}</CardTitle>
                <CardDescription>{t("daewooTagline")}</CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white">{t("nationwideCoverage")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{t("daewooAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>{t("daewooPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:fastex@daewoofastex.com" className="text-blue-600 hover:underline">
                    {t("daewooEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://daewoo.com.pk/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("daewooWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Ex */}
        <Card className="overflow-hidden border-t-4 border-t-green-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-green-600">{t("postex")}</CardTitle>
                <CardDescription>{t("postexTagline")}</CardDescription>
              </div>
              <Badge className="bg-green-600 text-white">{t("affordableRates")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{t("postexAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>{t("postexPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <a href="mailto:support@postex.pk" className="text-blue-600 hover:underline">
                    {t("postexEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://postex.pk/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("postexWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* M&P */}
        <Card className="overflow-hidden border-t-4 border-t-purple-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-purple-600">{t("mp")}</CardTitle>
                <CardDescription>{t("mpTagline")}</CardDescription>
              </div>
              <Badge className="bg-purple-600 text-white">{t("multipleServices")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>{t("mpAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span>{t("mpPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <a href="mailto:contact@mulphilog.com" className="text-blue-600 hover:underline">
                    {t("mpEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://www.mulphilog.com/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("mpWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trax */}
        <Card className="overflow-hidden border-t-4 border-t-orange-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-orange-600">{t("trax")}</CardTitle>
                <CardDescription>{t("traxTagline")}</CardDescription>
              </div>
              <Badge className="bg-orange-600 text-white">{t("multipleTiers")}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>{t("traxAddress")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span>{t("traxPhone")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <a href="mailto:info@trax.pk" className="text-blue-600 hover:underline">
                    {t("traxEmail")}
                  </a>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <a href="https://trax.pk/" target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {t("traxWebsite")}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

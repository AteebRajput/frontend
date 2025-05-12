import { Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/product-ui/Card"
import { Badge } from "../ui/Badge"

export default function LogisticsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Pakistan Logistics Companies</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        These are the Pakistan's leading logistics and courier companies for your shipping needs.
      </p>

      <div className="grid grid-cols-1 gap-8">
        {/* TCS */}
        <Card className="overflow-hidden border-t-4 border-t-red-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-red-600">TCS</CardTitle>
                <CardDescription>Pakistan's Premier Courier Service</CardDescription>
              </div>
              <Badge className="bg-red-600 text-white">Premium Service</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>CIVIL AVIATION, 101 - 104 Airport Road, Jinnah International Airport, Karachi, 74200</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span>(021) 111 123 456</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <a href="mailto:customerservices@tcs.com.pk" className="text-blue-600 hover:underline">
                    customerservices@tcs.com.pk
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://www.tcs.com.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit TCS Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LEOPARD */}
        <Card className="overflow-hidden border-t-4 border-t-yellow-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-yellow-600">LEOPARD</CardTitle>
                <CardDescription>Fast & Reliable Courier Service</CardDescription>
              </div>
              <Badge className="bg-yellow-600 text-white">Express Delivery</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>House, 19, Leopards, F, 19-F Imam Ahmed Rd, P.E.C.H.S Block 2 Block 6 PECHS, Karachi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <span>(021) 111 300 786</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <a href="mailto:customerservice@leopardscourier.com" className="text-blue-600 hover:underline">
                    customerservice@leopardscourier.com
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://www.leopardscourier.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-yellow-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit LEOPARD Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daewoo Fastex */}
        <Card className="overflow-hidden border-t-4 border-t-blue-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-blue-600">Daewoo Fastex</CardTitle>
                <CardDescription>Nationwide Logistics Network</CardDescription>
              </div>
              <Badge className="bg-blue-600 text-white">Nationwide Coverage</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>231-A Ferozepur Road, Kalma Chowk Lahore, Punjab Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>042-111-007-009</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <a href="mailto:fastex@daewoofastex.com" className="text-blue-600 hover:underline">
                    fastex@daewoofastex.com
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://daewoo.com.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit Daewoo Fastex Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Ex */}
        <Card className="overflow-hidden border-t-4 border-t-green-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-green-600">Post Ex</CardTitle>
                <CardDescription>Modern Logistics Solutions</CardDescription>
              </div>
              <Badge className="bg-green-600 text-white">Affordable Rates</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Lahore, Punjab</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span>support@postex.pk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <a href="mailto:support@postex.pk" className="text-blue-600 hover:underline">
                    support@postex.pk
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://postex.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit Post Ex Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* M&P */}
        <Card className="overflow-hidden border-t-4 border-t-purple-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-purple-600">M&P</CardTitle>
                <CardDescription>Comprehensive Logistics Services</CardDescription>
              </div>
              <Badge className="bg-purple-600 text-white">Multiple Services</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Town, Plot No. C-118 & C-119 Korangi Industrial Area, Karachi 31-A Mehran, Extension, Karachi,
                    Pakistan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span>(021) 111-202-202</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <a href="mailto:contact@mulphilog.com" className="text-blue-600 hover:underline">
                    contact@mulphilog.com
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://www.mulphilog.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit M&P Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trax */}
        <Card className="overflow-hidden border-t-4 border-t-orange-600">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-orange-600">Trax</CardTitle>
                <CardDescription>Efficient Delivery Solutions</CardDescription>
              </div>
              <Badge className="bg-orange-600 text-white">Multiple Service Tiers</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Plot 105, Sector 7-A, Mehran Town, Korangi, Karachi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <span>info@trax.pk</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <a href="mailto:info@trax.pk" className="text-blue-600 hover:underline">
                    info@trax.pk
                  </a>
                </div>
              </div>

              <div>
                <div className="flex justify-center mt-4">
                  <a
                    href="https://trax.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    Visit Trax Website
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

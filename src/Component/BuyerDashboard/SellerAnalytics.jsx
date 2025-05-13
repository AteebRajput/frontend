import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllSellersAnalytics } from "../../../slices/analyticsSlice"; // update path as needed
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/product-ui/Avatar";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sellers() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { sellersAnalytics, loading, error } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchAllSellersAnalytics());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-3xl font-bold text-black ">{t("agriTechEmpoweringFarmers")}</h1>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-black">{t("sellerAnalytics")}</h2>
            <p className="text-muted-foreground">
              {t("sellerAnalyticsDescription")}
            </p>
          </div>

          {loading ? (
            <p>{t("loading")}</p>
          ) : error ? (
            <p className="text-red-500">{t("error")}: {error}</p>
          ) : (
            <div className="grid gap-6">
              {sellersAnalytics.length > 0 ? (
                sellersAnalytics.map((seller) => (
                  <Link
                    key={seller._id || seller.id}
                    to={`/buyer-dashboard/sellers/${seller._id || seller.id}`}
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={`/placeholder.svg?text=${seller.name?.charAt(0)}`}
                                alt={seller.name}
                              />
                              <AvatarFallback>{seller.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{seller.name}</h3>
                              <p className="text-sm text-muted-foreground">{seller.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">{t("products")}</p>
                              <p className="text-sm">{seller.totalProducts}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{t("completion")}</p>
                              <p className="text-sm">{seller.completionPercentage}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{t("totalSales")}</p>
                              <p className="text-sm">
                                Rs. {seller.totalSales?.toLocaleString() || 0}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              {t("viewDetails")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p>{t("noSellersFound")}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

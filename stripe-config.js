/* ============================================================
   STRIPE-KONFIGURATION — LÄGG IN DINA LÄNKAR HÄR
   ============================================================
   1. Gå till https://dashboard.stripe.com/payment-links
   2. Skapa en Payment Link per skiva (pris, bild, lagerantal om du vill).
   3. Under "Payment methods" på länken — slå på både "Card" och "Klarna"
      (Klarna kräver att din Stripe-butik har SEK/EUR som valuta och att
      kontot är verifierat för Klarna i din region — Stripe visar det
      alternativet automatiskt om det är tillgängligt för dig).
   4. Kopiera varje länk (ser ut som https://buy.stripe.com/xxxxxxxx)
      och klistra in den mellan citattecknen nedan, för rätt produkt.
   5. Spara filen — knapparna aktiveras automatiskt på ALLA sidor som
      laddar denna fil. Produkter utan länk visar "Kommer snart".
   ============================================================ */
const STRIPE_LINKS = {
  "adewale-ayuba":                "",  // ADEWALE AYUBA — Bubble, 159 kr
  "tinariwen-hoggar":              "",  // TINARIWEN — Hoggar, 459 kr
  "noura-mint-seymali":            "",  // Noura Mint Seymali, 159 kr
  "imarhan":                       "",  // IMARHAN, 289 kr
  "amaar-808-club-tounsi":         "",  // AMAAR 808 — Club Tounsi, 469 kr
  "baba-zula-istanbul-sokaklari":  "",  // Baba Zula — Istanbul Sokaklari, 349 kr
  "mdou-moctar":                   "",  // Mdou Moctar, 149 kr
  "cornelis-vreeswijk":            "",  // Cornelis Vreeswijk, 75 kr
  "lovemore-majaivana":            ""   // Lovemore Majaivana, 189 kr
};

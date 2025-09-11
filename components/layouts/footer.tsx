import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Gem, Sparkles, Mail, Phone, MapPin, Activity, ShieldCheck, Truck, RefreshCw } from "lucide-react"

export function Footer() {
  const footerLinks = {
    jewelry: [
      { name: "Engagement Rings", href: "/jewelry/rings" },
      { name: "Wedding Bands", href: "/jewelry/rings" },
      { name: "Necklaces", href: "/jewelry/necklaces" },
      { name: "Earrings", href: "/jewelry/earrings" },
    ],
    perfumes: [
      { name: "Women's Fragrances", href: "/perfumes/women" },
      { name: "Men's Fragrances", href: "/perfumes/men" },
      { name: "Unisex Scents", href: "/perfumes/unisex" },
      { name: "Gift Sets", href: "/perfumes/gifts" },
    ],
    support: [
      { name: "Size Guide", href: "/size-guide" },
      { name: "Care Instructions", href: "/care" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-gradient-to-br from-[#fffdf9] to-[#fffdfa] border-t border-primary mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value Props: Reflect unique features implemented */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link href="/orders" aria-label="Real-time order updates" className="group flex items-center gap-3 p-4 rounded-lg border bg-white/50 hover:bg-primary/5 transition-colors">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Real-time order updates</div>
              <div className="text-xs text-muted-foreground">Track your order status live</div>
            </div>
          </Link>
          <Link href="/checkout" aria-label="Secure payments powered by Stripe" className="group flex items-center gap-3 p-4 rounded-lg border bg-white/50 hover:bg-primary/5 transition-colors">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Secure Stripe checkout</div>
              <div className="text-xs text-muted-foreground">Pay safely with cards via Stripe</div>
            </div>
          </Link>
          <Link href="/shipping" aria-label="Fast, reliable shipping" className="group flex items-center gap-3 p-4 rounded-lg border bg-white/50 hover:bg-primary/5 transition-colors">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Fast & reliable shipping</div>
              <div className="text-xs text-muted-foreground">Worldwide delivery options</div>
            </div>
          </Link>
          <Link href="/returns" aria-label="Easy returns and refunds" className="group flex items-center gap-3 p-4 rounded-lg border bg-white/50 hover:bg-primary/5 transition-colors">
            <RefreshCw className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium">Easy returns & refunds</div>
              <div className="text-xs text-muted-foreground">Hassle-free, transparent policy</div>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 gradient-primary rounded-full flex items-center justify-center jewelry-sparkle">
                <Gem className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-playfair gradient-text">Ramona Jewels</span>
                <span className="text-xs text-muted-foreground -mt-1">Jewelry & Fragrances</span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Your destination for exquisite jewelry and luxury fragrances. Each piece in our collection represents the
              pinnacle of craftsmanship and elegance.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@luxeatelier.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>123 Luxury Ave, New York, NY 10001</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-100 dark:to-orange-100 text-primary hover:scale-110 transition-transform"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-primary flex items-center space-x-2">
              <Gem className="h-4 w-4" />
              <span>Jewelry</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.jewelry.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Fragrances</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.perfumes.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Ramona. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

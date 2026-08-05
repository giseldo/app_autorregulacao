"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; icon: string; label: string; badge?: number };

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="sidebar-nav">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className={`nav-item ${active ? "active" : ""}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
            {!!item.badge && <span className="badge">{item.badge}</span>}
          </Link>
        );
      })}
    </div>
  );
}

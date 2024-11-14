import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react"

const links = [
  { label: 'Home', href: '/' },
  { label: 'Statistics', href: '/statistics' },
  { label: 'Insights', href: '/insights' },
  { label: 'Help', href: '/help' },
  { label: 'Settings', href: '/settings' }
];

const BottomNav = () => {
  const router = useRouter()

  return (
    <Navbar shouldHideOnScroll className="fixed top-0 w-full">
      <NavbarBrand>
        <span className="font-bold text-inherit">SpeakSense</span>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {links.map((link) => (
          <NavbarItem 
            key={link.label}
            isActive={router.pathname === link.href}
          >
            <Link 
              href={link.href}
              className={router.pathname === link.href ? 'text-primary' : ''}
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
    </Navbar>
  )
}

export default BottomNav
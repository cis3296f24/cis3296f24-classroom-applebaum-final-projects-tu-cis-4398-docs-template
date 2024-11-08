import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	Navbar, 
	NavbarBrand, 
	NavbarContent, 
	NavbarItem, 
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem
  } from "@nextui-org/navbar";

const BottomNav = () => {
	const router = useRouter()


	return (
		<Navbar shouldHideOnScroll>
      	<NavbarBrand>
        <span>SpeakSense</span>
      	</NavbarBrand>
      	<NavbarContent>
        {links.map((link) => (
          <NavbarItem key={link.label}>
            <Link href={link.href} passHref>
                {link.label}
            </Link>
          </NavbarItem>
        ))}
      	</NavbarContent>
		</Navbar>
	);
};

const links = [
	{
		label: 'Home', href: '/'},
	{
		label: 'Statistics', href: '/statistics'
	},
	{
		label: 'Insights', href: '/insights'
	},
	{
		label: 'Help', href: '/help'
	},
	{
		label: 'Settings', href: '/settings'
	}
];

export default BottomNav;


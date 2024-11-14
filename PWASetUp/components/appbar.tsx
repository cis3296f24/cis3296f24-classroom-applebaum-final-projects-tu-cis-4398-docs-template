import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar, NavbarBrand, NavbarItem, NavbarContent } from '@nextui-org/navbar'

const links = [
	{ label: 'Statistics', href: '/statistics' },
  { label: 'Insights', href: '/insights' },
  { label: 'Help', href: '/help' },
  { label: 'Settings', href: '/settings' }
]

const Appbar = () => {
	const router = useRouter()

	return (
		<Navbar
      isBordered
      className="w-full bg-zinc-100 dark:bg-zinc-900 pb-safe z-50">
      <NavbarBrand>
        <Link href='/' passHref>
        <p>SpeakSense</p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="mx-auto flex h-16 max-w-md  justify-around px-6">
          {links.map(({ href, label }) => (
            <NavbarItem key={label} isActive={router.pathname === href}>
              <Link href={href} passHref>
                <div
                  className={`flex h-full w-full flex-col  justify-center space-y-1 ${
                    router.pathname === href
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
                  }`}
                >
                  <p>
                    {label}
                  </p>
                </div>
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
    </Navbar>
	)
}

export default Appbar

import { createContext, useContext, type AnchorHTMLAttributes, type ReactNode } from "react";

const NavigationContext = createContext({ path: "/", navigate: (_to: string) => {} });
export function NavigationProvider({ path, navigate, children }: { path: string; navigate: (to: string) => void; children: ReactNode }) {
  return <NavigationContext.Provider value={{ path, navigate }}>{children}</NavigationContext.Provider>;
}
export function Link({ to, children, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const nav = useContext(NavigationContext);
  return <a href={to} {...props} onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) { event.preventDefault(); nav.navigate(to); } }}>{children}</a>;
}
export function useLocation() { const nav = useContext(NavigationContext); return { pathname: nav.path }; }
export function useNavigate() { return useContext(NavigationContext).navigate; }
export function Outlet() { return <div id="aubree-page-outlet" />; }

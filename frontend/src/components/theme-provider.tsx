"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// Pose la classe "dark" sur <html> selon le choix de l'utilisateur (ou le
// thème du système), ce qui active les variables .dark de globals.css.
export function ThemeProvider(props: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />
}

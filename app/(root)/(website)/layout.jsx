import Footer from '@/components/Website/Footer'
import Header from '@/components/Website/Header'
import { Kumbh_Sans } from 'next/font/google'
import React from 'react'

const kumbh = Kumbh_Sans({
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin']
})

const layout = ({ children }) => {
  return (
    <div className={kumbh.className}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default layout

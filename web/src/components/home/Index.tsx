'use client'

import Header from "./Header"
import Main from "./Main"
import Footer from "./Footer"

export default function Home() {
    return (
        <div className="h-screen paper-texture p-4 md:p-8 flex flex-col">
            <Header />
            <Main />
            <Footer />
        </div>
    )
}
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import Container from '../Container/Container'

function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-4">
            <Link to="/">
              <div className="inline-block bg-slate-800 p-2 rounded-xl">
                <Logo width="160px" />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              A modern full-stack blogging platform empowering writers, thinkers, and developers to share ideas globally.
            </p>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} MegaBlog. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Affiliate Program</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Customer Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Legals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms &amp; Conditions</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Licensing</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer

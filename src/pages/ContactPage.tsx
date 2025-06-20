import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const ContactPage = () => {
  return (
    <div className='min-h-screen bg-emerald-50'>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Main Page</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong>Address:</strong> 123 Tree Street, Garden City, GC 12345
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> +373 79 748 131
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> info@gardentrees.com
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
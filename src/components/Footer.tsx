import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
  <div className="container mx-auto flex justify-between items-center px-4">
    <p className="text-sm">&copy; 2023 YourCompany. All rights reserved.</p>
    <ul className="flex space-x-4">
      <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
      <li><a href="#" className="hover:text-gray-400">Terms of Service</a></li>
      <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
    </ul>
  </div>
</footer>
  )
}

export default Footer



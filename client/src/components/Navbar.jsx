import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const { user, setUser, setShowUserLogin, navigate, getCartCount } = useAppContext();

    const logout = () => {
        setUser(null);
        setOpen(false);
        navigate("/");
    };

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition">
                <img src="favicon.png" alt="GreenCart logo" className="w-10 h-10" />
                <h2 className="text-2xl font-bold text-green-600 tracking-wide">
                    GreenCart
                </h2>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <div className="hidden sm:flex items-center gap-8">

                    {/* Seller Dashboard Pill */}
                    <NavLink
                        to="/seller"
                        className="px-4 py-1.5 border border-gray-400 text-gray-500 rounded-full text-sm font-medium hover:bg-gray-100 hover:text-gray-700 transition"
                    >
                        Seller Dashboard
                    </NavLink>

                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/products">Products</NavLink>
                    {user && <NavLink to="/my-orders">My Orders</NavLink>}

                    {/* Search */}
                    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input
                            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                            type="text"
                            placeholder="Search products"
                        />

                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path
                                d="M10.836 10.615 15 14.695"
                                stroke="#7A7B7D"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                clipRule="evenodd"
                                d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
                                stroke="#7A7B7D"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Cart */}
                    <NavLink to="/cart" className="relative cursor-pointer">
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                                stroke="#2e856b"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        {getCartCount() > 0 && (
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-green-700 w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                {getCartCount()}
                            </button>
                        )}
                    </NavLink>

                    {/* Login / Logout */}
                    {!user ? (
                        <button type="button"
                            onClick={() => setShowUserLogin(true)}
                            className="px-8 py-2 bg-green-600 hover:bg-green-800 text-white rounded-full transition"
                        >
                            Login
                        </button>

                    ) : (
                        <div className="flex items-center gap-3">

                            {/* Profile Icon */}
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21a8 8 0 0 0-16 0" />
                                    <circle cx="12" cy="8" r="4" />
                                </svg>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={logout}
                                className="px-5 py-2 bg-green-600 hover:bg-green-800 text-white rounded-full transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setOpen(!open)}
                className="sm:hidden"
            >
                <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
                    <rect width="21" height="1.5" rx=".75" fill="#10694e" />
                    <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#10694e" />
                    <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#10694e" />
                </svg>
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-5 text-sm sm:hidden">

                    <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)}>Products</NavLink>

                    {user && (
                        <NavLink to="/orders" onClick={() => setOpen(false)}>
                            My Orders
                        </NavLink>
                    )}


                    {!user ? (
                        <button
                            onClick={() => {
                                setOpen(false);
                                setUserLogin(true);
                            }}
                            className="px-6 py-2 bg-green-600 hover:bg-green-800 text-white rounded-full"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            className="px-6 py-2 bg-green-600 hover:bg-green-800 text-white rounded-full"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import { FaProjectDiagram, FaTasks, FaTimes, FaUserPlus } from "react-icons/fa";
import { RiDashboardLine } from "react-icons/ri";
import { BiLogOut, BiMenu } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddMembers } from "../api/mutations";
import { MemberFormData, memberSchema } from "../form/form";
import { AnimatePresence, motion } from "framer-motion";
import { PiMicrosoftTeamsLogoBold } from "react-icons/pi";

export default function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [showAddMember, setShowAddMember] = useState(false);

  const addMember = useAddMembers();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });
  const handleAddMember = async (data: MemberFormData) => {
    try {
      if (!user?._id) {
        throw new Error("User ID is required");
      }
      const res = await addMember.mutateAsync({ ...data, userId: user._id });

      if(res.saved){
        toast.success(res.message)
      }else{
        toast.error(res.message)
      }
       
      setShowAddMember(false);
      reset();
    } catch {
      toast.error("Failed to add member. Please try again.");
    }
  };
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#121212] border-b border-[#1a1a1a] fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and primary navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={handleLinkClick}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0f717b] to-[#0f8a96] flex items-center justify-center">
                  <FaTasks className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">Piolet</span>
              </Link>
            </div>

            {/* Primary Navigation - Only show when logged in */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive("/dashboard")
                      ? "bg-[#0f717b] text-white"
                      : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <RiDashboardLine className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive("/projects")
                      ? "bg-[#0f717b] text-white"
                      : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <FaProjectDiagram className="w-4 h-4" />
                  <span>Projects</span>
                </Link>
                <Link
                  href="/team"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive("/team")
                      ? "bg-[#0f717b] text-white"
                      : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  <PiMicrosoftTeamsLogoBold className="w-4 h-4" />

                  <span>Team</span>
                </Link>

                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center px-3 py-1.5 bg-[#0f717b] cursor-pointer text-white rounded-lg hover:bg-teal-700 transition-all duration-200"
                >
                  <FaUserPlus className="w-5 h-5 mr-2" />
                  Add a New Member
                </button>
              </div>
            )}
          </div>

          {/* Right side - Auth navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-gray-300 flex items-center">
                  <span className="h-8 w-8 rounded-full bg-[#0f717b] flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200 flex items-center space-x-2"
                >
                  <BiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/login")
                      ? "bg-[#0f717b] text-white"
                      : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive("/signup")
                      ? "bg-[#0f717b] text-white"
                      : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#1a1a1a] focus:outline-none"
            >
              <BiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/dashboard")
                    ? "bg-[#0f717b] text-white"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/projects")
                    ? "bg-[#0f717b] text-white"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                Projects
              </Link>
              <div className="pt-4 pb-3 border-t border-[#1a1a1a]">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <span className="h-10 w-10 rounded-full bg-[#0f717b] flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/login")
                    ? "bg-[#0f717b] text-white"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/signup")
                    ? "bg-[#0f717b] text-white"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
                onClick={handleLinkClick}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showAddMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700/50"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Add Team Member
                </h2>
                <button
                  onClick={() => setShowAddMember(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleSubmit(handleAddMember)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                    placeholder="Enter member name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                  >
                    <option value="">Select a role</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Frontend Developer">
                      Frontend Developer
                    </option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">
                      Full Stack Developer
                    </option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="QA Engineer">QA Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.role.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-200 placeholder-gray-500"
                    placeholder="Enter member email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={addMember.isPending}
                    className="flex-1 bg-teal-600 text-white py-2.5 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addMember.isPending ? "Adding..." : "Add Member"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 bg-gray-700 text-white py-2.5 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

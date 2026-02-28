"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "@/public/assets/images/logo-black.png";
import {
  USER_DASHBOARD,
  WEBSITE_ABOUT,
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_SHOP,
} from "@/app/routes/WebsitePanelRoute";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import Cart from "./Cart";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import userIcon from "@/public/assets/images/user.png";
import { Avatar, AvatarImage } from "../ui/avatar";
import { HiMiniBars3 } from "react-icons/hi2";
import Search from "./Search";

const Header = () => {
  const auth = useSelector((store) => store.authStore.auth);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false)
  return (
    <div className="bg-white border-b lg:px-32 px-4">
      <div className="flex justify-between items-center lg:py-5 py-3">
        <Link href={WEBSITE_HOME}>
          <Image
            src={logo}
            width={383}
            height={146}
            alt="logo"
            className="lg:w-32 w-24"
          />
        </Link>

        <div className="lg:flex justify-between gap-20">
          <nav
            className={`lg:relative lg:w-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all lg:h-auto ${
              isMobileMenu ? "left-0" : "-left-full"
            }`}
          >
            <div className="lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3">
              <Image
                src={logo}
                width={383}
                height={146}
                alt="logo"
                className="lg:w-32 w-24"
              />

              <button type="button">
                <IoMdClose
                  size={25}
                  className="text-gray-500 hover:text-primary"
                  onClick={() => setIsMobileMenu(false)}
                />
              </button>
            </div>

            <ul className="lg:flex px-3 justify-between items-center gap-10">
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link href={WEBSITE_HOME} className="block py-2">
                  Home
                </Link>
              </li>
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link href={WEBSITE_ABOUT} className="block py-2">
                  About
                </Link>
              </li>
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link href={WEBSITE_SHOP} className="block py-2">
                  Shop
                </Link>
              </li>
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link
                  href={`${WEBSITE_SHOP}?category=t-shirts`}
                  className="block py-2"
                >
                  T-shirt
                </Link>
              </li>
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link
                  href={`${WEBSITE_SHOP}?category=hoodies`}
                  className="block py-2"
                >
                  Hoodies
                </Link>
              </li>
              <li className="text-gray-600 hover:text-primary hover:font-semibold">
                <Link
                  href={`${WEBSITE_SHOP}?category=oversized`}
                  className="block py-2"
                >
                  Oversized
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex justify-between items-center gap-8">
            <button type="button" onClick={() => setShowSearch(!showSearch)}>
              <IoIosSearch
                className="text-gray-500 hover:text-primary cursor-pointer"
                size={25}
              />
            </button>
            <Cart />

            {!auth ? (
              <Link href={WEBSITE_LOGIN}>
                <VscAccount
                  className="text-gray-500 hover:text-primary cursor-pointer"
                  size={25}
                />
              </Link>
            ) : (
              <Link href={USER_DASHBOARD}>
                <Avatar>
                  <AvatarImage src={auth?.avatar?.url || userIcon.src} />
                </Avatar>
              </Link>
            )}

            <button
              type="button"
              className="lg:hidden block"
              onClick={() => setIsMobileMenu(true)}
            >
              <HiMiniBars3
                size={25}
                className="text-gray-500 hover:text-primary"
              />
            </button>
          </div>
        </div>
      </div>

      <Search isShow={showSearch} />
    </div>
  );
};

export default Header;

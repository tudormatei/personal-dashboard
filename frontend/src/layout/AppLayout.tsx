import { type FC, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutContainer,
  Sidebar,
  SidebarItem,
  ContentArea,
  Separator,
} from "./AppLayout.styled";
import { FaAppleAlt, FaTrophy } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarItem to="/" active={pathname === "/"}>
          <FaHome size={22} />
        </SidebarItem>
        <SidebarItem to="/upload" active={pathname === "/upload"}>
          <IoMdCloudUpload size={22} />
        </SidebarItem>
        <Separator />
        <SidebarItem to="/weight" active={pathname === "/weight"}>
          <GiWeight size={22} />
        </SidebarItem>
        <SidebarItem to="/macros" active={pathname === "/macros"}>
          <FaAppleAlt size={22} />
        </SidebarItem>
        <SidebarItem to="/workouts" active={pathname === "/workouts"}>
          <LuDumbbell size={22} />
        </SidebarItem>
        <Separator />
        <SidebarItem to="/investments" active={pathname === "/investments"}>
          <FaMoneyBillTrendUp size={22} />
        </SidebarItem>
        <SidebarItem to="/wallet" active={pathname === "/wallet"}>
          <FaWallet size={22} />
        </SidebarItem>
        <Separator />
        <SidebarItem to="/mastery" active={pathname === "/mastery"}>
          <FaTrophy size={22} />
        </SidebarItem>
      </Sidebar>

      <ContentArea>{children}</ContentArea>
    </LayoutContainer>
  );
};

export default AppLayout;

import { type FC, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutContainer,
  Sidebar,
  SidebarItem,
  ContentArea,
  Logo,
  Separator,
} from "./AppLayout.styled";
import { FaAppleAlt } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoMdCloudUpload } from "react-icons/io";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <Link to="/">
          <Logo>D</Logo>
        </Link>
        <Separator />
        <SidebarItem to="/upload" active={pathname === "/upload"}>
          <IoMdCloudUpload size={22} />
        </SidebarItem>
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
      </Sidebar>

      <ContentArea>{children}</ContentArea>
    </LayoutContainer>
  );
};

export default AppLayout;

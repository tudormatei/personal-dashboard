import { type FC, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutContainer,
  Sidebar,
  SidebarItem,
  ContentArea,
  Logo,
} from "./AppLayout.styled";
import { FaHome, FaAppleAlt } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import { LuDumbbell } from "react-icons/lu";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <Logo>D</Logo>
        <SidebarItem to="/" active={pathname === "/"}>
          <FaHome size={22} />
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
      </Sidebar>

      <ContentArea>{children}</ContentArea>
    </LayoutContainer>
  );
};

export default AppLayout;
